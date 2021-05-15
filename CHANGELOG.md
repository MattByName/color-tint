# Color Tint Changelog

## 2.0.1

Usage of object.actor is deprecated for MenuButton

## 2.0.0

### Added
- Gnome 40 Support
- Multiple monitor support

### Fixes
- Now loads in Gnome 40
- Fixed various deprecated calls
- Colors now loading after bug caused by 'Slider.value = ' no longer working. Switched to 'Slider._setCurrentValue'
- Fixed problem where the Tint switch was defaulting to on when it should be to off
- Refactored constructor to match latest Gnome extension documentation

## 1.1.1

### Removed
- Removed version number from Readme (redundant)

### Fixes
- Updated metadata to say 3.34.1
  


## 1.1.0

### Fixes
These fixes refer to [Issue #2](https://github.com/MattByName/color-tint/issues/2)

- 'Slider.setValue' no longer works. Replaced with 'Slider.value ='. See also  [this issue](https://github.com/martin31821/cpupower/pull/90) on someone else's project
- No signal value-changed error also fixed. Replaced with 'notify::value'. See also [this issue](https://github.com/aleho/gnome-shell-volume-mixer/commit/5ec18540eaa53345d545cef6dfd343d4a8b0db55) on someone else's project

## 1.0.0
- Made changes requested by extension team
