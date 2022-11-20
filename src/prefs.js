'use strict';

const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.colortint');

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({ title: 'Overlay active on start' });
    group.add(row);

    // Create the switch and bind its value to the `autostart` key
    const toggle = new Gtk.Switch({
        active: settings.get_boolean ('autostart'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'autostart',
        toggle,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Add the switch to the row
    row.add_suffix(toggle);
    row.activatable_widget = toggle;

    // Create a new preferences row
    const row2 = new Adw.ActionRow({ title: 'Use monochrome system tray icon' });
    group.add(row2);

    // Create the switch and bind its value to the `monochrome` key
    const toggle2 = new Gtk.Switch({
        active: settings.get_boolean ('monochrome-icon'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'monochrome-icon',
        toggle,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Add the switch to the row
    row2.add_suffix(toggle2);
    row2.activatable_widget = toggle2;
    // Add our page to the window
    window.add(page);
}
