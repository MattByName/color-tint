##
# ColorTint - Gnome Shell Extension
#
# @file
# @version 0.1

.DEFAULT_GOAL := build
WORKING_DIR = tmp/
OUTPUT_DIR = bin/
OUTPUT_FNAME = colortint@matt.serverus.co.uk.zip
INSTALL_DIR = ~/.local/share/gnome-shell/extensions/colortint\@matt.serverus.co.uk

compile:
	glib-compile-schemas src/schemas/
.PHONY:compile

build: compile
# Delete the output dir
	rm -rf $(OUTPUT_DIR)
# Set up blank directories
	mkdir $(OUTPUT_DIR)
	mkdir $(WORKING_DIR)
# Construct the package in the working directory
	cp -r src/* $(WORKING_DIR)
	cp CHANGELOG.md $(WORKING_DIR)
	cp LICENSE $(WORKING_DIR)
	cp README.md $(WORKING_DIR)
# Uncomment below line once Gnome 44 is oldest supported version
#	rm $(WORKING_DIR)schemas/*.compiled
# zip the package and place in the output directory
	cd ./$(WORKING_DIR); zip -r ../$(OUTPUT_DIR)$(OUTPUT_FNAME) .
# delete the working directory
	rm -rf $(WORKING_DIR)
.PHONY:build

install: build
	rm -rf $(INSTALL_DIR)
	unzip $(OUTPUT_DIR)$(OUTPUT_FNAME) -d $(INSTALL_DIR)
# Uncomment below line once Gnome 44 is oldest supported version
# glib-compile-schemas $(INSTALL_DIR)/schemas/
.PHONY:install

test: install
	./nested-session.sh
.PHONY:install
# end
