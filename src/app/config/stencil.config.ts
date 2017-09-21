import { opmShapes } from './opm-shapes.config';
import {OpmObject} from "../models/OpmObject";
import {OpmProcess} from "../models/OpmProcess";
import {OpmThing} from "../models/OpmThing";
import {MyObj} from "../models/MyObject";


export const stencilConfig = {
  shapes: [
   //new opmShapes.Process,
    //new MyObj(),
    //new opmShapes.Object,
    new OpmObject(),
    new OpmProcess()

  ]
};
