
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const Lang = imports.lang;
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


const ColorTinter = new Lang.Class({
    Name: "ColorTinter",



    // Create Tint Overlay

    createOverlay: function() {
        let monitor = Main.layoutManager.primaryMonitor;
        overlay = new St.Bin({ reactive: false, x_fill: true, y_fill: true });
        overlay.set_size(monitor.width, monitor.height);
        overlay.opacity = 255;
        overlay.set_position(monitor.x, monitor.y);
        // Arbitrary z position above everything else
        overlay.set_z_position(650);
        this.setOverlayColor();

    },

    // Update color of Overlay
    setOverlayColor: function() {
        var color = new Clutter.Color(
            {
                red: overlay_color["red"],
                green: overlay_color["green"],
                blue: overlay_color["blue"],
                alpha: overlay_color["alpha"]
            });
        overlay.set_background_color(color);

    },
    // Hide Overlay
    hide: function() {

        Main.uiGroup.remove_actor(overlay);
    },
    // Show Overlay
    show: function() {
        Main.uiGroup.add_actor(overlay);
    },
    // Load Color

    // Save Color

    // enable
    enable: function()
    {
        this.createOverlay();
    },

    // disable
    disable : function() {
        overlay = null;
    },
})

const MenuButton = new Lang.Class({
    Name: "MenuButton",
    Extends: PanelMenu.Button,


    // Constructor
    _init: function () {
        this.parent(1, 'ColorTintMenu', false);
        let box = new St.BoxLayout();
        let icon =  new St.Icon({ icon_name: 'system-search-symbolic', style_class: 'system-status-icon'});
        let toplabel = new St.Label({ text: ' Menu ',
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER });

        // We add the icon, the label and a arrow icon to the box
        box.add(icon);
        box.add(toplabel);
        box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));

        // We add the box to the button
        // It will be showed in the Top Panel
        this.actor.add_child(box);

        let popupMenuExpander = new PopupMenu.PopupSubMenuMenuItem('PopupSubMenuMenuItem');

        // This is an example of PopupMenuItem, a menu item. We will use this to add as a submenu
        let submenu = new PopupMenu.PopupMenuItem('PopupMenuItem');

        // A new label
        let label = new St.Label({text:'Item 1'});

        // Add the label and submenu to the menu expander
        popupMenuExpander.menu.addMenuItem(submenu);
        popupMenuExpander.menu.box.add(label);

        // Other standard menu items

        let offswitch = new PopupMenu.PopupSwitchMenuItem('PopupSwitchMenuItem');


        // Assemble all menu items

        // This is a menu separator
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.menu.addMenuItem(offswitch);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        offswitch.connect('toggled', Lang.bind(this, function(object, value){
            // We will just change the text content of the label
            if(value) {
                tinter.show()
            } else {
                tinter.hide()
            }
        }));



        this._redSlider = new Slider.Slider(0);
        this._greenSlider = new Slider.Slider(0);
        this._blueSlider = new Slider.Slider(0);
        this._alphaSlider = new Slider.Slider(0);


        let _redLabel = new St.Label({text: "Red  "});
        this._redSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._redSliderContainer.actor.add(_redLabel);
        this._redSliderContainer.actor.add(this._redSlider.actor, {expand: true});
        this.menu.addMenuItem(this._redSliderContainer);


        let _greenLabel = new St.Label({text: "Green"});
        this._greenSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._greenSliderContainer.actor.add(_greenLabel);
        this._greenSliderContainer.actor.add(this._greenSlider.actor, {expand: true});
        this.menu.addMenuItem(this._greenSliderContainer);


        let _blueLabel = new St.Label({text: "Blue "});
        this._blueSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._blueSliderContainer.actor.add(_blueLabel);
        this._blueSliderContainer.actor.add(this._blueSlider.actor, {expand: true});
        this.menu.addMenuItem(this._blueSliderContainer);

        let _alphaLabel = new St.Label({text: "Alpha"});
        this._alphaSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._alphaSliderContainer.actor.add(_alphaLabel);
        this._alphaSliderContainer.actor.add(this._alphaSlider.actor, {expand: true});
        this.menu.addMenuItem(this._alphaSliderContainer);

        this._redSlider.connect('value-changed', Lang.bind(this,this._setColors));
        this._blueSlider.connect('value-changed', Lang.bind(this,this._setColors));
        this._greenSlider.connect('value-changed', Lang.bind(this,this._setColors));
        this._alphaSlider.connect('value-changed', Lang.bind(this,this._setColors));

        this._getColors();


    },
    _getColors: function () {
        this._redSlider.setValue(overlay_color["red"] / 255);
        this._greenSlider.setValue(overlay_color["green"] / 255);
        this._blueSlider.setValue(overlay_color["blue"] / 255);
        this._alphaSlider.setValue(overlay_color["alpha"] / 255);
    },
    _setColors: function () {
        overlay_color["red"] = 255 * this._redSlider._getCurrentValue();
        overlay_color["green"] = 255 * this._greenSlider._getCurrentValue();
        overlay_color["blue"] = 255 * this._blueSlider._getCurrentValue();
        overlay_color["alpha"] = 255 * this._alphaSlider._getCurrentValue();

        tinter.setOverlayColor();
    },

})


function init() {

}

function enable() {
    tinter = new ColorTinter();
    tinter.enable();
    menu = new MenuButton();
    Main.panel.addToStatusArea("ChatStatus", menu, 0, "right");

}

function disable() {
    tinter.disable();
    tinter = null;
    menu = null;

}
