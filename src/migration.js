export function migrateSettings(settings) {
  const old = settings.get_user_value("autostart");
  if (old !== null) {
    settings.set_enum("startup-behavior", old.get_boolean() ? 1 : 0);
    settings.reset("autostart");
  }
}
