import * as common from '../common/commonFunctions';
import {basicDefinitions} from '../config/basicDefinitions';

const linkDefinition = {
  defaults: common._.defaultsDeep({
    type: 'opm.Link',
    attrs: {'.connection': { 'stroke-width': 2, 'stroke-dasharray': '8 5' }},
    labels: [{ position: 0.5, attrs: { text: { text: '' } } }]
  }, common.joint.dia.Link.prototype.defaults)
};

export class OpmLink extends common.joint.dia.Link.extend(linkDefinition) {
}
