import * as common from '../../../common/commonFunctions';
import {linkConnectionType} from '../../ConfigurationOptions';

const linkDefinition = {
  defaults: common._.defaultsDeep({
    type: 'opm.Link',
    attrs: {'.connection': { 'stroke-width': 2, 'stroke-dasharray': '8 5', 'stroke': 'black'}},
    labels: [{ position: 0.5, attrs: { text: {
      text: '',
      'font-family': 'Arial, helvetica, sans-serif',
      'font-size': 10,
      fill: 'red',
      'font-weight': 200} } }]
  }, common.joint.shapes.devs.Link.prototype.defaults)
};

export class OpmDefaultLink extends common.joint.shapes.devs.Link.extend(linkDefinition) {
  getDefaultLinkParams() {
    return {
      sourceElementId: this.getSourceElement().get('id'),
      targetElementId: this.getTargetElement().get('id'),
      vertices: this.get('vertices'),
      linkConnectionType: (this.attr('.connection/stroke-dasharray') === 0) ? linkConnectionType.systemic : linkConnectionType.enviromental,
      textColor: this.get('labels')[0].attrs.text.fill,
      textFontWeight: this.get('labels')[0].attrs.text['font-weight'],
      textFontSize: this.get('labels')[0].attrs.text['font-size'],
      textFontFamily: this.get('labels')[0].attrs.text['font-family'],
      strokeColor: this.attr('.connection/stroke'),
      strokeWidth: this.attr('.connection/stroke-width'),
    };
  }
  doubleClickHandle(cellView, evt, paper) {}
  changeAttributesHandle() {}
  changeSizeHandle() {}
}
