
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;

let tinter = null;

const MenuButton = new Lang.Class({
    Name: "MenuButton",
    Extends: PanelMenu.Button,
    _init: function () {},
    createButton: function () {},
    deleteButton: function () {},

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
}

function init() {

}

function enable() {
    tinter = new ColorTinter();
    tinter.enable();

}

function disable() {
    tinter.disable();
    tinter = null;

}
