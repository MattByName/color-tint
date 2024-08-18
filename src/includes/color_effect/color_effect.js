////////////////////////////////////////////////////////////////////////////////////////////////
//  This code is derived from the CoverFlowAltTab project which in turn was derived	      //
//  from the blur-my-shell project. All three projects are published under the		      //
//  GPL-3.0-or-later license.								      //
// 											      //
//  To see the alterations made to the original code taken from CoverFlowAltTab,	      //
//  run this command:									      //
// 											      //
//  git diff aa000fa2ccff9c2eef56a1bdac13edf596732018 HEAD				      //
//   src/includes/color_effect/color_effect.js						      //
// 											      //
// ------------------------------------------------------------------------------------------ //
// 											      //
// 											      //
//  Copyright (C) 2022-2024 Aurélien Hamy (blur-my-shell) Copyright (C) 2023-2024	      //
//  Daniel Sheeler (CoverFlowAltTab) Copyright (C) 2024- Matthew Barnard		      //
//  (ColorTint)										      //
// 											      //
//  blur-my-shell: <https://github.com/aunetx/blur-my-shell> CoverFlowAltTab:		      //
//  <https://github.com/dsheeler/CoverflowAltTab>					      //
// 											      //
//  This program is free software: you can redistribute it and/or modify it under	      //
//  the terms of the GNU General Public License as published by the Free Software	      //
//  Foundation, either version 3 of the License, or (at your option) any later		      //
//  version.										      //
// 											      //
//  This program is distributed in the hope that it will be useful, but WITHOUT ANY	      //
//  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A	      //
//  PARTICULAR PURPOSE.  See the GNU General Public License for more details.		      //
// 											      //
//  You should have received a copy of the GNU General Public License along with	      //
//  this program.  If not, see <http://www.gnu.org/licenses/>.				      //
// 											      //
////////////////////////////////////////////////////////////////////////////////////////////////

import Clutter from 'gi://Clutter';
import Shell from 'gi://Shell';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';

const SHADER_PATH = GLib.filename_from_uri(GLib.uri_resolve_relative(import.meta.url, 'color_effect.glsl', GLib.UriFlags.NONE))[0];

const get_shader_source = _ => {
    try {
        return Shell.get_file_contents_utf8_sync(SHADER_PATH);
    } catch (e) {
        log(`[ColorTint] error loading shader from ${SHADER_PATH}: ${e}`);
        return null;
    }
};

/// New Clutter Shader Effect that simply mixes a color in, the class applies
/// the GLSL shader programmed into vfunc_get_static_shader_source and applies
/// it to an Actor.
///
/// Clutter Shader Source Code:
/// https://github.com/GNOME/clutter/blob/master/clutter/clutter-shader-effect.c
///
/// GJS Doc:
/// https://gjs-docs.gnome.org/clutter10~10_api/clutter.shadereffect
export const ColorEffect = new GObject.registerClass({
    GTypeName: "CoverflowAltTabColorEffect",
    Properties: {
        'red': GObject.ParamSpec.double(
            `red`,
            `Red`,
            `Red value in shader`,
            GObject.ParamFlags.READWRITE,
            0.0, 1.0,
            0.4,
        ),
        'green': GObject.ParamSpec.double(
            `green`,
            `Green`,
            `Green value in shader`,
            GObject.ParamFlags.READWRITE,
            0.0, 1.0,
            0.4,
        ),
        'blue': GObject.ParamSpec.double(
            `blue`,
            `Blue`,
            `Blue value in shader`,
            GObject.ParamFlags.READWRITE,
            0.0, 1.0,
            0.4,
        ),
        'blend': GObject.ParamSpec.double(
            `blend`,
            `Blend`,
            `Amount of blending between the colors`,
            GObject.ParamFlags.READWRITE,
            0.0, 1.0,
            0.4,
        ),
    }
}, class CoverflowAltTabColorShader extends Clutter.ShaderEffect {
    _init(params) {
        this._red = null;
        this._green = null;
        this._blue = null;
        this._blend = null;

        // initialize without color as a parameter

        let _color = params.color;
        delete params.color;

        super._init(params);

        // set shader source

        this._source = get_shader_source();

        if (this._source)
            this.set_shader_source(this._source);

        // set shader color

        if (_color)
            this.color = _color;

        this.update_enabled();
    }

    get red() {
        return this._red;
    }

    set red(value) {
        if (this._red !== value) {
            this._red = value;

            this.set_uniform_value('red', parseFloat(this._red - 1e-6));
        }
    }

    get green() {
        return this._green;
    }

    set green(value) {
        if (this._green !== value) {
            this._green = value;

            this.set_uniform_value('green', parseFloat(this._green - 1e-6));
        }
    }

    get blue() {
        return this._blue;
    }

    set blue(value) {
        if (this._blue !== value) {
            this._blue = value;

            this.set_uniform_value('blue', parseFloat(this._blue - 1e-6));
        }
    }

    get blend() {
        return this._blend;
    }

    set blend(value) {
        if (this._blend !== value) {
            this._blend = value;

            this.set_uniform_value('blend', parseFloat(this._blend - 1e-6));
        }
        this.update_enabled();
    }

    set color(rgba) {
        let [r, g, b, a] = rgba;
        this.red = r;
        this.green = g;
        this.blue = b;
        this.blend = a;
    }

    get color() {
        return [this.red, this.green, this.blue, this.blend];
    }

    /// False set function, only cares about the color. Too hard to change.
    set(params) {
        this.color = params.color;
    }

    update_enabled() {
        this.set_enabled(true);
    }


    vfunc_paint_target(paint_node = null, paint_context = null) {
        this.set_uniform_value("tex", 0);

        if (paint_node && paint_context)
            super.vfunc_paint_target(paint_node, paint_context);
        else if (paint_node)
            super.vfunc_paint_target(paint_node);
        else
            super.vfunc_paint_target();
    }
});
