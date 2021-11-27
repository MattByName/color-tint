"use strict";

const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const UiGroup = imports.ui.main.layoutManager.uiGroup;

const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Slider = imports.ui.slider;

const ExtensionSystem = imports.ui.extensionSystem;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const ShellVersion = imports.misc.config.PACKAGE_VERSION.split(".");
const BrightnessEffectName = "brightness-effect";

let tinter = null;
let menu = null;
let overlay = {
  active: false,
  brightness: 100,
};

let ExtensionPath;
if (ShellVersion[1] === 2) {
  ExtensionPath =
    ExtensionSystem.extensionMeta["alphatint@saifulbkhan.github.com"].path;
} else {
  ExtensionPath = imports.misc.extensionUtils.getCurrentExtension().path;
}

const AlphaTinter = new Lang.Class({
  Name: "AlphaTinter",

  // Create Tint Overlay
  createOverlay: function () {
    this._effect = new Clutter.BrightnessContrastEffect();
    this.setOverlayBrightness();
  },

  // Update color of overlay
  setOverlayBrightness: function () {
    this._effect.brightness = Clutter.Color.new(
      overlay["brightness"],
      overlay["brightness"],
      overlay["brightness"],
      255
    );
    if (overlay.active) {
      UiGroup.remove_effect_by_name(BrightnessEffectName);
      UiGroup.add_effect_with_name(BrightnessEffectName, this._effect);
    }
    this.saveState();
  },

  // Hide overlay
  hide: function () {
    overlay.active = false;
    UiGroup.remove_effect_by_name(BrightnessEffectName);
    this.saveState();
  },

  // Show overlay
  show: function () {
    UiGroup.add_effect_with_name(BrightnessEffectName, this._effect);
    overlay.active = true;
    this.saveState();
  },

  // Load state
  loadState: function () {
    // Load last from json
    this._file = Gio.file_new_for_path(ExtensionPath + "/settings.json");
    if (this._file.query_exists(null)) {
      let [flag, data] = this._file.load_contents(null);

      if (flag) {
        const ByteArray = imports.byteArray;
        let prepData =
          data instanceof Uint8Array
            ? ByteArray.toString(data)
            : data.toString();
        overlay = JSON.parse(prepData);
      }
    }
  },

  // Save state
  saveState: function () {
    this._file = Gio.file_new_for_path(ExtensionPath + "/settings.json");
    this._file.replace_contents(JSON.stringify(overlay), null, false, 0, null);
  },

  // Enable
  start_up: function () {
    overlay.active = false;
    this.loadState();
    this.createOverlay();
  },

  // Disable
  stop_now: function () {
    if (overlay.active == true) {
      UiGroup.remove_effect_by_name(BrightnessEffectName);
    }
  },
});

const MenuButton = new Lang.Class({
  Name: "MenuButton",
  Extends: PanelMenu.Button,

  // Constructor
  _init: function () {
    this.parent(1, "AlphaTintMenu", false);
    let box = new St.BoxLayout();
    let icon = new St.Icon({
      icon_name: "display-brightness-symbolic",
      style_class: "system-status-icon",
    });

    // We add the icon, the label and a arrow icon to the box
    box.add(icon);

    // We add the box to the button
    // It will be showed in the Top Panel
    this.add_child(box);

    let popupMenuExpander = new PopupMenu.PopupSubMenuMenuItem(
      "PopupSubMenuMenuItem"
    );

    // This is an example of PopupMenuItem, a menu item. We will use this to add as a submenu
    let submenu = new PopupMenu.PopupMenuItem("PopupMenuItem");

    // A new label
    let label = new St.Label({ text: "Item 1" });

    // Add the label and submenu to the menu expander
    popupMenuExpander.menu.addMenuItem(submenu);
    popupMenuExpander.menu.box.add(label);

    let offswitch = new PopupMenu.PopupSwitchMenuItem("Tint", overlay.active);

    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this.menu.addMenuItem(offswitch);
    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

    offswitch.connect(
      "toggled",
      Lang.bind(this, function (_object, value) {
        // We will just change the text content of the label
        if (value) {
          tinter.show();
        } else {
          tinter.hide();
        }
      })
    );

    this._alphaSlider = new Slider.Slider(0);
    let _alphaLabel = new St.Label({ text: "Brightness" });
    this._alphaSliderContainer = new PopupMenu.PopupBaseMenuItem({
      activate: false,
    });
    this._alphaSliderContainer.add_child(_alphaLabel);
    this._alphaSliderContainer.add_child(this._alphaSlider);
    this.menu.addMenuItem(this._alphaSliderContainer);

    this._alphaSlider.connect(
      "notify::value",
      Lang.bind(this, this._setBrightness)
    );

    this._getBrightness();
  },

  _getBrightness: function () {
    this._alphaSlider._setCurrentValue(
      this._alphaSlider,
      (overlay["brightness"] - 64) / 63
    );
  },

  _setBrightness: function () {
    overlay["brightness"] = 64 + this._alphaSlider._getCurrentValue() * 63;
    tinter.setOverlayBrightness();
  },
});

function constructor() {}

function enable() {
  tinter = new AlphaTinter();
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

function init() {}
