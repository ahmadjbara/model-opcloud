import { opmShapes } from './opm-shapes.config';
import {OpmObject} from "../models/DrawnPart/OpmObject";
import {OpmProcess} from "../models/DrawnPart/OpmProcess";
import {OpmThing} from "../models/DrawnPart/OpmThing";

export const stencilConfig = {
  shapes: [
    new opmShapes.Process,
    new opmShapes.Object
  ]
};
