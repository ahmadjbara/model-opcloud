import {linkConnectionType} from '../../ConfigurationOptions';
import {linkTypeSelection} from '../../../configuration/elementsFunctionality/linkTypeSelection';
import {OpmState} from '../OpmState';
import {validationAlert} from '../../../configuration/rappidEnviromentFunctionality/shared';
import {createDialog} from '../../../configuration/elementsFunctionality/linkDialog';
import {joint, _} from '../../../configuration/rappidEnviromentFunctionality/shared';
import {OpmLinkRappid} from "./OpmLinkRappid";
import { oplFunctions} from "../../../opl-generation/opl-functions";


const linkDefinition = {
  defaults: _.defaultsDeep({
    markup: '<g class="scalable"><g class="rotatable"><text/></g></g>',
    type: 'opm.Link',
    connector: {
      name : 'jumpover'
    },
    attrs: {'.connection': { 'stroke-width': 2, 'stroke-dasharray': '8 5', 'stroke': 'black'}},
    labels: [{ position: 0.5, attrs: { text: {
      text: '',
      'font-family': 'Arial, helvetica, sans-serif',
      'font-size': 10,
      fill: 'red',
      'font-weight': 200} } }]
  }, joint.shapes.devs.Link.prototype.defaults)
};

export class OpmDefaultLink extends OpmLinkRappid {
  constructor(id?:string) {
    super();
    this.set(this.linkAttributes());
    this.attr(this.linkAttrs());
    this.IDSetter(id);
  }

  IDSetter(id){
    if(id){
      this.set('id',id);
    }
  }



  linkAttributes() {
    return {
      type: 'opm.Link',
      name: 'defaultLink',
      connector: {
        name : 'jumpover'
      },
      labels: [{
        position:{ distance: 0.5, offset: { x: -10, y: -10 }},
        attrs: { text: {
        text: '',
        'font-family': 'Arial, helvetica, sans-serif',

        'font-size': 12,
        fill: 'black',
        'font-weight': 'bold'},
        rect: { stroke: 'none', 'fill-opacity': 0 },} }
        ,
        {
          position:{ distance: 0.5, offset: { x: 10, y: 10 }},
          attrs: { text: {
            text: '',
            'font-family': 'Arial, helvetica, sans-serif',
            'font-size': 12,
            fill: 'black',
            'font-weight': 'bold'},
            rect: { stroke: 'none', 'fill-opacity': 0 },} }

        ],

        'font-size': 10,
        fill: 'black',
        'font-weight': 200} } }]

    };

  }
  linkAttrs() {
    return {
      '.connection': { 'stroke-width': '2', 'stroke-dasharray': '8 5', 'stroke': 'black'}
    };
  }
  getDefaultLinkParams() {
    return {
      sourceElementId: this.getSourceElement() ? this.getSourceElement().get('id') : null,
      targetElementId: this.getTargetElement() ? this.getTargetElement().get('id') : null,
      vertices: this.get('vertices'),
      linkConnectionType: (this.attr('.connection/stroke-dasharray') === '0') ? linkConnectionType.systemic : linkConnectionType.enviromental,
      textColor: this.get('labels')[0].attrs.text.fill,
      textFontWeight: this.get('labels')[0].attrs.text['font-weight'],
      textFontSize: this.get('labels')[0].attrs.text['font-size'],
      textFontFamily: this.get('labels')[0].attrs.text['font-family'],
      strokeColor: this.attr('.connection/stroke'),
      id: this.get('id')
    };
  }
  doubleClickHandle(cellView, evt, paper) {}
  pointerUpHandle(cellView) {
    let errorMessage;
    // If it is a new link and is not connected to any element - deleting it.
    // Otherwise it will be reconnected to the previous element.
    if (!this.attributes.target.id && !this.get('previousTargetId')) {
      errorMessage = 'A link must be connected to a target element';
      this.remove();
    } else if (!this.attributes.target.id && this.get('previousTargetId')) {
      this.set({'target': {'id': this.get('previousTargetId')}});
    }
    if (!this.attributes.source.id && this.get('previousSourceId')) {
      this.set({'source': {'id': this.get('previousSourceId')}});
    }
    if (this.getSourceElement() && this.getTargetElement()) {
      if (this.getTargetElement().id === this.getSourceElement().get('parent')) {
        errorMessage = 'A state cannot be connected to his object!';
      }
      if ((this.getSourceElement() instanceof OpmState) &&
        (this.getTargetElement() instanceof OpmState) &&
        this.getSourceElement().get('parent') === this.getTargetElement().get('parent')) {
        errorMessage = 'A link cannot connect between two states inside the same object!';
      }
      if (this.getSourceElement().id === this.getTargetElement().id) {
        errorMessage = 'An element cannot be connected to itself!';
      }
    }
    if (errorMessage) {
      validationAlert(errorMessage);
      this.remove();
    }
  }
  changeAttributesHandle() {}
  changeSizeHandle() {}
  changePositionHandle() {}
  removeHandle(options) {}
  addHandle(options) {
    this.on('change:target change:source', (link, a, b) => {
      const source = this.getSourceElement();
      const target = this.getTargetElement();
      if ((source && target) && (source.id !== target.id) &&
        (target.id !== source.get('parent')) &&
        !((source instanceof OpmState) && (target instanceof OpmState) &&
          source.get('parent') === target.get('parent'))) {
         if (!this.get('previousTargetId') || (this.get('previousTargetId') !== this.attributes.target.id)) {
            const relevantLinks = oplFunctions.generateLinksWithOpl(this);
            if (relevantLinks.length > 0) {
              this.set('previousTargetId', this.attributes.target.id);
              this.set('previousSourceId', this.attributes.source.id);
              if (!b.cameFromInZooming) {
                createDialog(options, this );
              }
            }
        }
      }
    });
  }
}
