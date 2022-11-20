const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Slider = imports.ui.slider;
let tinter = null;
let menu = null;
let overlay = null;

let overlay_color = {
    red: 20,
    green: 20,
    blue: 20,
    alpha: 80,

};

let overlay_active = false;

const ExtensionSystem = imports.ui.extensionSystem;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const ShellVersion = imports.misc.config.PACKAGE_VERSION.split('.');

let ExtensionPath;
if (ShellVersion[1] === 2) {
    ExtensionPath = ExtensionSystem.extensionMeta['colortint@matt.serverus.co.uk'].path;
} else {
    ExtensionPath = imports.misc.extensionUtils.getCurrentExtension().path;
}

const ColorTinter = GObject.registerClass({
    GTypeName: "ColorTinter",
}, class ColorTinter extends GObject.Object {


    // Create Tint Overlay

    createOverlay() {

        /*
        Set the overlay to 100x the primary monitor's width and height. Set the overlay x and y to 0.
        This is hacky, but should cover most multi-setups.
        What should be done, is to iterate over all monitors, and create a seperate overlay for each that fills each
        according to its dimensions. If anyone wants to refactor this in that way, please do.
         */

        let monitor = Main.layoutManager.primaryMonitor;
        overlay = new St.Bin({reactive: false});
        overlay.set_size(monitor.width * 100, monitor.height * 100);
        overlay.opacity = 255;
        overlay.set_position(0, 0);
        // Arbitrary z position above everything else
        overlay.set_z_position(650);

        this.setOverlayColor();



    }



    // Update color of Overlay
    setOverlayColor() {

        var color = new Clutter.Color(
            {
                red: overlay_color["red"],
                green: overlay_color["green"],
                blue: overlay_color["blue"],
                alpha: overlay_color["alpha"]
            });
        overlay.set_background_color(color);
        this.saveColor();

    }


    // Hide Overlay
    hide() {
        overlay_active = false;
        Main.uiGroup.remove_actor(overlay);
    }


    // Show Overlay
    show() {
        Main.uiGroup.add_actor(overlay);
        overlay_active = true;
    }

    // Load Color
    loadColor() {
        // Load last from json

        this._file = Gio.file_new_for_path(ExtensionPath + '/settings.json');
        if (this._file.query_exists(null)) {
            var flag;
            var data;
            [flag, data] = this._file.load_contents(null);

            if (flag) {
                const ByteArray = imports.byteArray;
                let prepData = (data instanceof Uint8Array) ? ByteArray.toString(data) : data.toString();
                overlay_color = JSON.parse(prepData);
            }


        }
    }



    // Save Color
    saveColor() {
        this._file = Gio.file_new_for_path(ExtensionPath + '/settings.json');
        this._file.replace_contents(JSON.stringify(overlay_color), null, false, 0, null);
    }


    // enable
    start_up() {
        this.settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.colortint');
        overlay_active = this.settings.get_boolean('autostart');
        this.loadColor();
        this.createOverlay();

    }



    // disable
    stop_now() {

        if (overlay_active == true) {
            Main.uiGroup.remove_actor(overlay);
        }
        overlay.destroy();
        overlay = null;

    }


})

const MenuButton = GObject.registerClass ({
    GTypeName: 'MenuButton',}, class MenuButton extends PanelMenu.Button {


    // Constructor
    _init() {
        super._init(1, 'ColorTintMenu', false);
        let box = new St.BoxLayout();
        let icon = new St.Icon({icon_name: 'applications-graphics-symbolic', style_class: 'system-status-icon'});

        // We add the icon
        icon.gicon = Gio.icon_new_for_string(`${Me.path}/icon.svg`);
        icon.set_icon_size(20)
        box.add(icon);

        // We add the box to the button
        // It will be showed in the Top Panel
        this.add_child(box);

        let popupMenuExpander = new PopupMenu.PopupSubMenuMenuItem('PopupSubMenuMenuItem');

        // This is an example of PopupMenuItem, a menu item. We will use this to add as a submenu
        let submenu = new PopupMenu.PopupMenuItem('PopupMenuItem');

        // A new label
        let label = new St.Label({text: 'Item 1'});

        // Add the label and submenu to the menu expander
        popupMenuExpander.menu.addMenuItem(submenu);
        popupMenuExpander.menu.box.add(label);

        // Other standard menu items

        let offswitch = new PopupMenu.PopupSwitchMenuItem('Tint', false);


        // Assemble all menu items

        // This is a menu separator
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.menu.addMenuItem(offswitch);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        offswitch.connect('toggled', (object, value) => {
            // We will just change the text content of the label
            if (value) {
                tinter.show()
            } else {
                tinter.hide()
            }
        });


        this._redSlider = new Slider.Slider(0);
        this._greenSlider = new Slider.Slider(0);
        this._blueSlider = new Slider.Slider(0);
        this._alphaSlider = new Slider.Slider(0);


        let _redLabel = new St.Label({text: "R"});
        this._redSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._redSliderContainer.add_child(_redLabel);
        this._redSliderContainer.add_child(this._redSlider);
        this.menu.addMenuItem(this._redSliderContainer);


        let _greenLabel = new St.Label({text: "G"});
        this._greenSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._greenSliderContainer.add_child(_greenLabel);
        this._greenSliderContainer.add_child(this._greenSlider);
        this.menu.addMenuItem(this._greenSliderContainer);


        let _blueLabel = new St.Label({text: "B"});
        this._blueSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._blueSliderContainer.add_child(_blueLabel);
        this._blueSliderContainer.add_child(this._blueSlider);
        this.menu.addMenuItem(this._blueSliderContainer);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        let _alphaLabel = new St.Label({text: "Alpha"});
        this._alphaSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._alphaSliderContainer.add_child(_alphaLabel);
        this._alphaSliderContainer.add_child(this._alphaSlider);
        this.menu.addMenuItem(this._alphaSliderContainer);

        this._redSlider.connect('notify::value', this._setColors.bind(this));
        this._blueSlider.connect('notify::value', this._setColors.bind(this));
        this._greenSlider.connect('notify::value', this._setColors.bind(this));
        this._alphaSlider.connect('notify::value', this._setColors.bind(this));

        this._getColors();


    }
    _getColors() {


        this._redSlider._setCurrentValue(this._redSlider, overlay_color["red"] / 255)
        this._blueSlider._setCurrentValue(this._blueSlider, overlay_color["blue"] / 255)
        this._greenSlider._setCurrentValue(this._greenSlider, overlay_color["green"] / 255)
        this._alphaSlider._setCurrentValue(this._alphaSlider, overlay_color["alpha"] / 255)


    }
    _setColors() {

        overlay_color["red"] = 255 * this._redSlider._getCurrentValue();
        overlay_color["green"] = 255 * this._greenSlider._getCurrentValue();
        overlay_color["blue"] = 255 * this._blueSlider._getCurrentValue();
        overlay_color["alpha"] = 255 * this._alphaSlider._getCurrentValue();

        tinter.setOverlayColor();
    }

})



function enable() {

    tinter = new ColorTinter();
    tinter.start_up();
    menu = new MenuButton();
    Main.panel.addToStatusArea("Tint", menu, 0, "right");

}

function disable() {
    tinter.stop_now();
    tinter = null;
    menu.destroy();
    menu = null;

}


function init() {


}

