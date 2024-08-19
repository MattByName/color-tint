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

import Gio from "gi://Gio";
import Adw from "gi://Adw";
import Gtk from "gi://Gtk";

import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class ColorTintPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window._settings = this.getSettings();
    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({ title: "Overlay active on start" });
    group.add(row);

    // Create the switch and bind its value to the `autostart` key
    const toggle = new Gtk.Switch({
      active: window._settings.get_boolean("autostart"),
      valign: Gtk.Align.CENTER,
    });
    window._settings.bind(
      "autostart",
      toggle,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );

    // Add the switch to the row
    row.add_suffix(toggle);
    row.activatable_widget = toggle;

    // Create a new preferences row
    const row_alpha_cap = new Adw.ActionRow({ title: "Cap maximum alpha" });
    group.add(row_alpha_cap);

    // Create the switch and bind its value to the `autostart` key
    const toggle_alpha_cap = new Gtk.Switch({
      active: window._settings.get_boolean("cap-alpha"),
      valign: Gtk.Align.CENTER,
    });
    window._settings.bind(
      "cap-alpha",
      toggle_alpha_cap,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );

    // Add the switch to the row
    row_alpha_cap.add_suffix(toggle_alpha_cap);
    row_alpha_cap.activatable_widget = toggle_alpha_cap;
    // Create a new preferences row
    const row2 = new Adw.ActionRow({
      title: "Use monochrome system tray icon",
      subtitle: "Changes take effect on restart of extension",
    });
    group.add(row2);

    // Create the switch and bind its value to the `monochrome` key
    const toggle2 = new Gtk.Switch({
      active: window._settings.get_boolean("monochrome-icon"),
      valign: Gtk.Align.CENTER,
    });
    window._settings.bind(
      "monochrome-icon",
      toggle2,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );

    // Add the switch to the row
    row2.add_suffix(toggle2);
    row2.activatable_widget = toggle2;
      
    ////////////////////
    // Color Selector //
    ////////////////////
    let color_selector_group = new Adw.PreferencesGroup; 
    page.add(color_selector_group);
    let color_picker = new Gtk.ColorDialog({
      with_alpha: true,}
    );
    let color_picker_button = new Gtk.ColorDialogButton({
      dialog: color_picker,
    }); 
    color_picker_button.connect('notify::rgba', _ => {
      let c = color_picker_button.rgba;
      let val = new GLib.Variant("(ddd)", [c.red, c.green, c.blue]);
      window._settings.set_value("tint-color", val);
    });
    let c = window._settings.get_value("overlay-color").deep_unpack();
    let rgba = color_picker_button.rgba;
    rgba.red = c[0];
    rgba.green = c[1];
    rgba.blue = c[2];
    rgba.alpha = c[3];
    color_picker_button.set_rgba(rgba);
    color_picker_button.connect('notify::rgba', _ => {
      let c = color_picker_button.rgba;
      let val = new GLib.Variant("(ddd)", [c.red, c.green, c.blue]);
      window._settings.set_value("tint-color", val);
    });
    color_selector_group.add(color_picker_button);
    // Add our page to the window
    window.add(page);
  }
}
