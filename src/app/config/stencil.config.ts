import { opmShapes } from './opm-shapes.config';
import {OpmObject} from "../models/OpmObject";
import {OpmProcess} from "../models/OpmProcess";
import {OpmThing} from "../models/OpmThing";

export const stencilConfig = {
  shapes: [
    new opmShapes.Process,
    new opmShapes.Object
  ]
};
