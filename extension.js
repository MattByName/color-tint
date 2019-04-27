
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;

let tinter = null;
let menu = null;

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


    },



})

const ColorTinter = new Lang.Class({
    Name: "ColorTinter",

    // Create Tint Overlay

    // Delete Tint Overlay

    // Set color of Overlay

    // Hide Overlay

    // Show Overlay

    // Load Color

    // Save Color

    // enable
    enable: function()
    {},

    // disable
    disable : function() {},
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
