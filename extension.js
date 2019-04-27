
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;

let tinter = null;
let menu = null;
let overlay = null;

var overlay_color = {
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
        Main.notify('Hide Overlay');
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
    disable : function() {},
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
