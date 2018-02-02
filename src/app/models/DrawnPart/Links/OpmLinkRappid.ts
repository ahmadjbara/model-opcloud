import {joint, _} from '../../../configuration/rappidEnviromentFunctionality/shared';

const OpmLinkRappidDefinition = {
  defaults: _.defaultsDeep({}, joint.shapes.devs.Link.prototype.defaults),

}

export class OpmLinkRappid extends joint.shapes.devs.Link.extend(OpmLinkRappidDefinition) {

}
