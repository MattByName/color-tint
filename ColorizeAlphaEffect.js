import GObject from "gi://GObject";
import Clutter from "gi://Clutter";

const ColorizeAlphaEffect = GObject.registerClass({
    GTypeName: "ColorizeAlphaEffect" },    Properties: {
        'tint-color': GObject.ParamSpec.object(
            'tint-color',
            'Tint Color',
            'A read-write string property',
            GObject.ParamFlags.READWRITE,
           Clutter.Color 
        ),
    },
 class ColorizeAlphaEffect extends Clutter.Effect {
    constructor(constructProperties = {}) {
        super(constructProperties);
    }

     vfunc_paint(node, paint_context, flags){
// code goes here

}});
