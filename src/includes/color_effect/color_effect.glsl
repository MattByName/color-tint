////////////////////////////////////////////////////////////////////////////////////////////////
//  This code is derived from the CoverFlowAltTab project which in turn was derived	      //
//  from the blur-my-shell project. All three projects are published under the		      //
//  GPL-3.0-or-later license.								      //
// 											      //
//  To see the alterations made to the original code taken from CoverFlowAltTab,	      //
//  run this command:									      //
// 											      //
//  git diff aa000fa2ccff9c2eef56a1bdac13edf596732018 HEAD				      //
//   src/includes/color_effect/color_effect.glsl					      //
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

uniform sampler2D tex;
uniform float red;
uniform float green;
uniform float blue;
uniform float blend;

void main() {
    vec4 s = texture2D(tex, cogl_tex_coord_in[0].st);
    vec4 dst = vec4(red, green, blue, blend);
    cogl_color_out = vec4(mix(s.rgb, dst.rgb * s.a, blend), s.a);
}