import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';
import {OpmStructuralLink} from './OpmStructuralLink';
import * as common from '../../../common/commonFunctions';

export  class OpmFundamentalLink extends OpmStructuralLink {
  sourceElement: OpmEntity;
  targetElement: OpmEntity;
  triangle: any;
  mainUpperLink: OpmDefaultLink;
  constructor(sourceElement, targetElement, graph) {
    super();
    this.sourceElement = sourceElement;
    this.targetElement = targetElement;
    // Get all outgoing links from the source element
    const outboundLinks = graph.getConnectedLinks(this.sourceElement, { outbound: true });
    for (const pt in outboundLinks) {
      // Already exists a link with the same type
      if (outboundLinks[pt].get('OpmLinkType') === this.constructor.name) {
        this.mainUpperLink = outboundLinks[pt];
        this.triangle = outboundLinks[pt].getTargetElement();
      }
    }
    // If didn't found a matching link, need to create one and a triangle
    if (!this.triangle) {
      this.triangle = new TriangleClass();
      const newX = (this.sourceElement.getBBox().center().x + this.targetElement.getBBox().center().x) / 2 - 15;
      const newY = (this.sourceElement.getBBox().center().y + this.targetElement.getBBox().center().y) / 2;
      this.triangle.set('position', {x: newX, y: newY});
      this.triangle.set('size', {width: 30, height: 25});
      this.triangle.set('numberOfTargets', 0);
      // Define the link from the source element to the triangle
      const newLink = new OpmDefaultLink();
      newLink.set({
        source: {id: this.sourceElement.id},
        target: {id: this.triangle.id, port: 'in'},
        router: {name: 'manhattan', args: { step: 5}},
        OpmLinkType: this.constructor.name
      });
      newLink.attr({
        '.link-tools': {display: 'none'},
        '.marker-arrowheads': {display: 'none'},
        '.connection': {'stroke-dasharray': '0'}
      });
      this.mainUpperLink = newLink;
      graph.addCells([this.triangle, newLink]);
    }
    // Define the connection from the triangle to the current link
    this.set({
      source: {id: this.triangle.id, port: 'out'},
      target: {id: this.targetElement.id},
      router: {name: 'manhattan', args: { step: 5}}
    });
    this.attr({attrs: {
      '.link-tools': {display: 'none'},
      '.marker-arrowheads': {display: 'none'}
    }});
    let numberOfTargets = this.triangle.get('numberOfTargets') + 1;
    this.triangle.set('numberOfTargets', numberOfTargets);
  }
  getFundamentalLinkParams() {
    const params = {
      symbolPos: [this.triangle.get('position').x, this.triangle.get('position').y],
      UpperConnectionVertices: this.mainUpperLink.get('vertices')
    };
    return {...super.getStructuralLinkParams(), ...params};
  }
  removeHandle(options) {
    super.removeHandle(options);
    const triangle = options.graph.getCell(this.get('source').id);
    const numberOfTargets = triangle.get('numberOfTargets');
    if (numberOfTargets > 1) {
      triangle.set('numberOfTargets', (numberOfTargets - 1));
    } else {
      triangle.remove();
    }
  }
}

export class TriangleClass extends common.joint.shapes.devs.Model.extend({
  markup: '<image/>',
  defaults: common._.defaultsDeep({
    type: 'opm.TriangleAgg',
    size: {width: 31, height: 30},
    inPorts: ['in'],
    outPorts: ['out'],
    ports: {
      groups: {
        'in': {
          position: {
            name: 'top'
          },
          attrs: {
            '.port-body': {
              fill: 'black',
              magnet: 'passive',
              r: 1
            }
          },
          label: {markup: '<text class="label-text"/>'}
        },
        'out': {
          position: {
            name: 'bottom'
          },
          attrs: {
            '.port-body': {
              fill: 'black',
              magnet: 'passive',
              r: 1
            }
          },
          label: {markup: '<text class="label-text"/>'}
        }
      }
    },
    attrs: {
      image: { 'xlink:href': '../../assets/OPM_Links/StructuralAgg.png', width: 30, height: 30},
    }
  }, common.joint.shapes.devs.Model.prototype.defaults)
}) {
  doubleClickHandle(cellView, evt, paper) {}
  pointerUpHandle(cellView) {}
  changeAttributesHandle() {}
  changeSizeHandle() {}
  changePositionHandle() {}
  removeHandle(options) {}
}
