/** @module ColorTint */
import St from "gi://St";
import Clutter from "gi://Clutter";
import Gio from "gi://Gio";
import GObject from "gi://GObject";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import * as Slider from "resource:///org/gnome/shell/ui/slider.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
/**
 * Tracks whether or not the overlay is currently being drawn.
 * @type {boolean}
 * */
let overlay_active = false;
let overlay = null;
let settings = null;
let metadata = null;
let tinter = null;
/**
 * Record of the color to be stored or applied.
 * @typedef {Object} overlay_color - The color to be stored or applied to the overlay
 * @property {number} red - the RGBA red value 0-255
 * @property {number} green - the RGBA green value 0-255
 * @property {number} blue - the RGBA blue value 0-255
 * @property {number} alpha - the RGBA alpha value 0-255
 */
let overlay_color = {
  red: 20,
  green: 20,
  blue: 20,
  alpha: 80,
};
/** Public class defining the extension
 * @public*/
export default class ColorTinter extends Extension {
  /**
   * This class is constructed once when your extension is loaded, not
   * enabled. This is a good time to setup translations or anything else you
   * only do once.
   *
   * You MUST NOT make any changes to GNOME Shell, connect any signals or add
   * any event sources here.
   *
   * @param {ExtensionMeta} metadata - An extension meta object
   */
  constructor(metadata) {
    super(metadata);
  }

  /**
   * This will hold MenuButton, the PanelMenuButton that will place the interface
   * in the system tray
   * @type {MenuButton}*/
  menu = null;

  /**
   * This function is called when your extension is enabled, which could be
   * done in GNOME Extensions, when you log in or when the screen is unlocked.
   *
   * This is when you should setup any UI for your extension, change existing
   * widgets, connect signals or modify GNOME Shell's behavior.
   */
  enable() {
    tinter = this;
    settings = this.getSettings();
    metadata = this.metadata;
    this.start_up();
    this.menu = new MenuButton();
    Main.panel.addToStatusArea("Tint", menu, 0, "right");
  }
  /**
   * This function is called when your extension is uninstalled, disabled in
   * GNOME Extensions or when the screen locks.
   *
   * Anything you created, modified or setup in enable() MUST be undone here.
   * Not doing so is the most common reason extensions are rejected in review!
   */
  disable() {
    this.stop_now();
    menu.destroy();
    menu = null;
    settings = null;
    metadata = null;
    tinter = null;
  }

  /**
        Set the overlay to 100x the primary monitor's width and height. Set the overlay x and y to 0.
        This is hacky, but should cover most multi-setups.
        What should be done, is to iterate over all monitors, and create a seperate overlay for each that fills each
        according to its dimensions. If anyone wants to refactor this in that way, please do.
         */
  createOverlay() {
    let monitor = Main.layoutManager.primaryMonitor;
    overlay = new St.Bin({ reactive: false });
    overlay.set_size(monitor.width * 100, monitor.height * 100);
    overlay.opacity = 255;
    overlay.set_position(0, 0);
    // Arbitrary z position above everything else
    overlay.set_z_position(650);

    this.setOverlayColor();
  }

  /**
   * Apply the value stored in colortint#color */
  setOverlayColor() {
    var color = new Clutter.Color({
      red: overlay_color["red"],
      green: overlay_color["green"],
      blue: overlay_color["blue"],
      alpha: overlay_color["alpha"],
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

    this._file = Gio.file_new_for_path(`${metadata.path}/settings.json`);
    if (this._file.query_exists(null)) {
      var flag;
      var data;
      [flag, data] = this._file.load_contents(null);

      if (flag) {
        const TexDec = new TextDecoder();
        let prepData =
          data instanceof Uint8Array ? TexDec.decode(data) : data.toString();
        overlay_color = JSON.parse(prepData);
      }
    }
  }

  // Save Color
  saveColor() {
    this._file = Gio.file_new_for_path(`${metadata.path}/settings.json`);
    this._file.replace_contents(
      JSON.stringify(overlay_color),
      null,
      false,
      0,
      null,
    );
  }

  start_up() {
    overlay_active = false;
    this.loadColor();
    this.createOverlay();
    if (settings.get_boolean("autostart")) this.show();
  }

  stop_now() {
    if (overlay_active == true) Main.uiGroup.remove_actor(overlay);

    overlay.destroy();
    overlay = null;
  }
}
/**
 * PanelMenu button extended for the extension UI
 * @extends {PanelMenu.Button}
 * @type {GObject.Class}*/
const MenuButton = GObject.registerClass(
  { GTypeName: "MenuButton" },
  /**
   * The systemtray button
   * @extends {PanelMenu.Button} */
  class MenuButton extends PanelMenu.Button {
    /**
     * Initialises the widget.
     * */
    _init() {
      super._init(1, "ColorTintMenu", false);
      /**
       * Layout for the menu
       * @type {Object}*/
      let box = new St.BoxLayout();
      /**
       * Icon graphic for the menu, will appear in system tray
       * @type {Object}*/
      let icon = new St.Icon({
        icon_name: "applications-graphics-symbolic",
        style_class: "system-status-icon",
      });

      /**
       * Stores the filename of the menu icon
       * @type {string} */
      let iconName = "";

      if (settings.get_boolean("monochrome-icon")) iconName = "icon_mono.svg";
      else iconName = "icon.svg";

      icon.gicon = Gio.icon_new_for_string(`${metadata.path}/${iconName}`);
      icon.set_icon_size(20);
      box.add(icon);

      // We add the box to the button
      // It will be showed in the Top Panel
      this.add_child(box);

      // Other standard menu items
      /**
       * The on/off toggle. Name 'tint' will not be displayed due to icon. Pass
       * {overlay_active} to determine if it should show on or off.
       * @type {PopupMenu.PopupSwitchMenuItem}*/
      let offswitch = new PopupMenu.PopupSwitchMenuItem("Tint", overlay_active);

      // Assemble all menu items

      // This is a menu separator
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
      this.menu.addMenuItem(offswitch);
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      offswitch.connect("toggled", (object, value) => {
        // We will just change the text content of the label
        if (value) tinter.show();
        else tinter.hide();
      });

      this._redSlider = new Slider.Slider(0);
      this._greenSlider = new Slider.Slider(0);
      this._blueSlider = new Slider.Slider(0);
      this._alphaSlider = new Slider.Slider(0);

      let _redLabel = new St.Label({ text: "R" });
      this._redSliderContainer = new PopupMenu.PopupBaseMenuItem({
        activate: false,
      });
      this._redSliderContainer.add_child(_redLabel);
      this._redSliderContainer.add_child(this._redSlider);
      this.menu.addMenuItem(this._redSliderContainer);

      let _greenLabel = new St.Label({ text: "G" });
      this._greenSliderContainer = new PopupMenu.PopupBaseMenuItem({
        activate: false,
      });
      this._greenSliderContainer.add_child(_greenLabel);
      this._greenSliderContainer.add_child(this._greenSlider);
      this.menu.addMenuItem(this._greenSliderContainer);

      let _blueLabel = new St.Label({ text: "B" });
      this._blueSliderContainer = new PopupMenu.PopupBaseMenuItem({
        activate: false,
      });
      this._blueSliderContainer.add_child(_blueLabel);
      this._blueSliderContainer.add_child(this._blueSlider);
      this.menu.addMenuItem(this._blueSliderContainer);

      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      let _alphaLabel = new St.Label({ text: "Alpha" });
      this._alphaSliderContainer = new PopupMenu.PopupBaseMenuItem({
        activate: false,
      });
      this._alphaSliderContainer.add_child(_alphaLabel);
      this._alphaSliderContainer.add_child(this._alphaSlider);
      this.menu.addMenuItem(this._alphaSliderContainer);

      this._redSlider.connect("notify::value", this._setColors.bind(this));
      this._blueSlider.connect("notify::value", this._setColors.bind(this));
      this._greenSlider.connect("notify::value", this._setColors.bind(this));
      this._alphaSlider.connect("notify::value", this._setColors.bind(this));

      this._getColors();
    }

    _getColors() {
      this._redSlider._setCurrentValue(
        this._redSlider,
        overlay_color["red"] / 255,
      );
      this._blueSlider._setCurrentValue(
        this._blueSlider,
        overlay_color["blue"] / 255,
      );
      this._greenSlider._setCurrentValue(
        this._greenSlider,
        overlay_color["green"] / 255,
      );
      this._alphaSlider._setCurrentValue(
        this._alphaSlider,
        overlay_color["alpha"] / 255,
      );
    }

    _setColors() {
      overlay_color["red"] = 255 * this._redSlider._getCurrentValue();
      overlay_color["green"] = 255 * this._greenSlider._getCurrentValue();
      overlay_color["blue"] = 255 * this._blueSlider._getCurrentValue();
      overlay_color["alpha"] = 255 * this._alphaSlider._getCurrentValue();

      tinter.setOverlayColor();
    }
  },
);
