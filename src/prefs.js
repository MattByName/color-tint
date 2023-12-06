import Gio from "gi://Gio";
import Adw from "gi://Adw";
import Gtk from "gi://Gtk";

import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class ColorTintPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window._settings = this.getSettings("org.gnome.shell.extensions.colortint");
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
    // Add our page to the window
    window.add(page);
  }
}
