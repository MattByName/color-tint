/**
 * Copyright (C) 2024  Matthew Barnard
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import St from "gi://St";
import Clutter from "gi://Clutter";
import Gio from "gi://Gio";
import GObject from "gi://GObject";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import * as Slider from "resource:///org/gnome/shell/ui/slider.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import {ColorEffect} from "./includes/color_effect/color_effect.js";
let overlay_active = false;
let menu = null;
let overlay = null;
let settings = null;
let metadata = null;
let tinter = null;
let overlay_color = {
  red: 0.20,
  green: 0.20,
  blue: 0.20,
  alpha: 0.4,
};

export default class ColorTinter extends Extension {
  constructor(metadata) {
    super(metadata);
  }

  enable() {
    tinter = this;
    settings = this.getSettings();
    metadata = this.metadata;
    this.start_up();
    menu = new MenuButton();
    Main.panel.addToStatusArea("Tint", menu, 0, "right");
    settings.connect('changed::overlay-color', (settings, key) => {
      this.updateColor();
    });
  }
    

  updateColor() {

    let c = settings.get_value("overlay-color").deep_unpack();
    overlay_color['red'] = c[0];
    overlay_color['green'] = c[1];
    overlay_color['blue'] = c[2];
    overlay_color['alpha'] = c[3];
    if (overlay_active)
      this.refreshOverlay();
  }

  disable() {
    this.stop_now();
    menu.destroy();
    menu = null;
    settings = null;
    metadata = null;
    tinter = null;
  }
  _toggleGlobalEffect(name, effect, properties = {}) {
    if (Main.uiGroup.get_effect(name)) {
      Main.uiGroup.remove_effect_by_name(name);
    } else {
      let eff = new effect(properties);
      Main.uiGroup.add_effect_with_name(name, eff);
    }
  }
  refreshOverlay() {
    this.hide();
    this.show();
  }
  toggleEffect() {
    let effect = ColorEffect;
    this._toggleGlobalEffect('ColorTintOverlay', effect, {
      red: overlay_color["red"],
      green: overlay_color["green"],
      blue: overlay_color["blue"],
      blend: overlay_color["alpha"],
    }); 
  }

  // Hide Overlay
  hide() {
    this.toggleEffect();
    overlay_active = false;
  }

  // Show Overlay
  show() {
    this.toggleEffect();
    overlay_active = true;
  }

  start_up() {
    this.updateColor();
    overlay_active = settings.get_boolean("autostart"); 
    if (settings.get_boolean("autostart")) {
      this.show();
    }

  }
  stop_now() {
    if (overlay_active)
      this.toggleEffect();
  }
}
const MenuButton = GObject.registerClass(
  { GTypeName: "MenuButton" },
  class MenuButton extends PanelMenu.Button {
    // Constructor
    _init() {
      super._init(1, "ColorTintMenu", false);
      let box = new St.BoxLayout();
      let icon = new St.Icon({
        icon_name: "applications-graphics-symbolic",
        style_class: "system-status-icon",
      });

      // We add the icon
      let iconName = "";

      if (settings.get_boolean("monochrome-icon")) iconName = "icon_mono.svg";
      else iconName = "icon.svg";

      icon.gicon = Gio.icon_new_for_string(`${metadata.path}/${iconName}`);
      icon.set_icon_size(20);
      box.add_child(icon);

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
      popupMenuExpander.menu.box.add_child(label);

      // Other standard menu items
      let offswitch = new PopupMenu.PopupSwitchMenuItem("Tint", overlay_active);
      // This is a menu separator
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
      this.menu.addMenuItem(offswitch);
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
      offswitch.connect("toggled", (object, value) => {
        // We will just change the text content of the label
        if (value) tinter.show();
        else tinter.hide();
      });


    }

  }
);
