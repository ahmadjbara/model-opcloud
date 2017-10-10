import {OpmObject} from '../models/DrawnPart/OpmObject';
import {OpmProcess} from '../models/DrawnPart/OpmProcess';

export const stencilConfig = {
  shapes: [
    new OpmProcess,
    new OpmObject
  ]
};
