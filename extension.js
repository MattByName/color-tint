
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const ColorTinter = new Lang.Class({
    Name: "ColorTinter",

    // Create Tint Overlay

    // Delete Tint Overlay

    // Set color of Overlay

    // Hide Overlay

    // Show Overlay

    // Load Color

    // Save Color

    // Create Menu

    // Delete Menu

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
