import GLib from 'gi://GLib';
import St from 'gi://St';

import * as Dialog from 'resource:///org/gnome/shell/ui/dialog.js';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';


// Creating a modal dialog
let aboutDialog = new ModalDialog.ModalDialog({
  destroyOnClose: false,
  styleClass: 'about-dialog',
});

let reminderId = null;
let closedId = aboutDialog.connect('closed', () => {
  console.debug('The dialog was dismissed, so set a reminder');

  if (!reminderId) {
    reminderId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60,
      () => {
        aboutDialog.open(global.get_current_time());

        reminderId = null;
        return GLib.SOURCE_REMOVE;
      });
  }
});

aboutDialog.connect('destroy', () => {
  console.debug('The dialog was destroyed, so reset everything');

  if (closedId) {
    aboutDialog.disconnect(closedId);
    closedId = null;
  }

  if (reminderId) {
    GLib.Source.remove(reminderId);
    reminderId = null;
  }

  aboutDialog = null;
});


// Adding a widget to the content area
const listLayout = new Dialog.ListSection({
  title: 'Todo List',
});
aboutDialog.contentLayout.add_child(listLayout);

const taskOne = new Dialog.ListSectionItem({
  icon_actor: new St.Icon({icon_name: 'dialog-information-symbolic'}),
  title: 'Task One',
  description: 'The first thing I need to do',
});
listLayout.list.add_child(taskOne);

const taskTwo = new Dialog.ListSectionItem({
  icon_actor: new St.Icon({icon_name: 'dialog-information-symbolic'}),
  title: 'Task Two',
  description: 'The next thing I need to do',
});
listLayout.list.add_child(taskTwo);


// Adding buttons
aboutDialog.setButtons([
  {
    label: 'Close',
    action: () => aboutDialog.destroy(),
  },
  {
    label: 'Later',
    isDefault: true,
    action: () => aboutDialog.close(global.get_current_time()),
  },
]);
