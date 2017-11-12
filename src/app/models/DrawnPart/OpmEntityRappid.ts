import {joint, _} from '../../configuration/rappidEnviromentFunctionality/shared';

const OpmEntityRappidDefinition = {
  defaults: _.defaultsDeep({}, joint.shapes.basic.Generic.prototype.defaults)};

export class OpmEntityRappid extends joint.dia.Element.extend(OpmEntityRappidDefinition) {}
