import * as common from '../../../common/commonFunctions';

const linkDefinition = {
  defaults: common._.defaultsDeep({
    type: 'opm.Link',
    attrs: {'.connection': { 'stroke-width': 2, 'stroke-dasharray': '8 5' }},
  }, common.joint.shapes.devs.Link.prototype.defaults)
};

export class OpmDefaultLink extends common.joint.shapes.devs.Link.extend(linkDefinition) {
}
