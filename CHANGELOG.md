# ColorTint Changelog

## 2.3.5 - 2024-03-27
### Fixed
- A bug caused by accidentally deleting lines of code has been repaired
## 2.3.4 - 2024-03-26

### Added
- GNOME 46 Support
### Removed
- Clutter.Container usage
## 2.3.2 - 2023-12-08

### Added
- GNOME 45 Support

### Changed
- Imports now use ES modules

### Removed

- GNOME 44 and older will not be supported going forward. See table in the [Readme](./README.md)
  for legacy compatibility.

## 2.3.1

### Fixed

- Tested on Gnome 44

## 2.3.0

### Added

- Makefile packaging
- Monochrome icon
- Autolaunch toggle in settings menu

## 2.2.2

### Added

- GNOME 43 support confirmed

### Fixed

- Error in packaging script repaired
- Minor corrections in changelog

## 2.2.1

### Added

- Version compatibility table in README

### Fixed

- Verified support with 3.38 and 3.36 and included in metadata

## 2.2.0

### Added

- Adds logo as icon
- Placed source into src folder
- Added install script
- Added packaging script

### Fixed

- Confirms GNOME 41 support

## 2.1.0

### Fixed

- Now loads in Gnome 42
- Adopted [new GJS Class Syntax](https://gjs.guide/guides/gjs/legacy-class-syntax.html#comparison-between-legacy-and-es6)

## 2.0.2

### Fixed

- Resolved warning: Disabling extension Error: Attempting to remove actor of type 'StBin' from group of class 'Gjs_ui_layout_UiActor', but the container is not the actor's parent.
- Resolved warning: Some code called array.toString() on a Uint8Array instance.

## 2.0.1

### Fixed

Responded to Gnome Extension moderator feedback:

- Resolved warning: Usage of object.actor is deprecated for MenuButton
- Resolved warning: Usage of object.actor is deprecated for Slider
- Removed log calls
- Removed Extension class and returning Extension class in init() function (extension.js).

## 2.0.0

### Added

- Gnome 40 Support
- Multiple monitor support

### Fixed

- Now loads in Gnome 40
- Fixed various deprecated calls
- Colors now loading after bug caused by 'Slider.value = ' no longer working. Switched to 'Slider.\_setCurrentValue'
- Fixed problem where the Tint switch was defaulting to on when it should be to off
- Refactored constructor to match latest Gnome extension documentation

## 1.1.1

### Removed

- Removed version number from Readme (redundant)

### Fixed

- Updated metadata to say 3.34.1

## 1.1.0

### Fixed

These fixes refer to [Issue #2](https://github.com/MattByName/color-tint/issues/2)

- 'Slider.setValue' no longer works. Replaced with 'Slider.value ='. See also [this issue](https://github.com/martin31821/cpupower/pull/90) on someone else's project
- No signal value-changed error also fixed. Replaced with 'notify::value'. See also [this issue](https://github.com/aleho/gnome-shell-volume-mixer/commit/5ec18540eaa53345d545cef6dfd343d4a8b0db55) on someone else's project

## 1.0.0

- Made changes requested by extension team
