import {OpmThing} from './OpmThing';
import {processInzooming, processUnfolding} from '../../configuration/elementsFunctionality/process-inzooming';
import {joint, _, paddingObject} from '../../configuration/rappidEnviromentFunctionality/shared';

export class OpmProcess extends OpmThing {
  constructor() {
    super();
    this.set(this.processAttributes());
    this.attr({text: {text: 'Process'}});
    this.attr({ellipse: {stroke: '#0000FF', rx: 40, ry: 40, cx: 40, cy: 40}});
    this.attr({ellipse: this.entityShape()});
    this.attr({ellipse: this.thingShape()});
  }
  processAttributes() {
    return {
      markup: `<g class="rotatable"><g class="scalable"><ellipse/></g><text/></g>`,
      type: 'opm.Process',
      padding: 35
    };
  }
  processAttrs() {
    return {
      ellipse: {
        ...this.entityShape(), ...this.thingShape(),
        ...{stroke: '#0000FF', rx: 40, ry: 40, cx: 40, cy: 40}
      },
      'text': {text: 'Process'}
    };
  }
  getParams() {
    const params = {
      fill: this.attr('ellipse/fill'),
      strokeColor: this.attr('ellipse/stroke'),
      strokeWidth: this.attr('ellipse/stroke-width'),
      parentheses: (this.attr('value/value') === 'None') ? false : true
    };
    return {...super.getThingParams(), ...params};
  }
  removeHandle(options) {
    options.treeViewService.removeNode(this.id);
  }
  // options = init-rappid service
  haloConfiguration(halo, options) {
    halo.addHandle(this.addHandleGenerator('manage_complexity', 'sw', 'Click to manage complexity', 'left'));
    halo.on('action:manage_complexity:pointerdown', function (evt, x, y) {
      const contextToolbar = new joint.ui.ContextToolbar({
        theme: 'modern',
        tools: [
          { action: 'In-Zoom', content:  this.options.cellView.model.attributes.attrs.ellipse['stroke-width'] === 4 ? 'Show In-Zoomed' : 'In-Zoom' },
          { action: 'Unfold', content: this.options.cellView.model.attributes.attrs.ellipse['stroke'] === '#FF0000' ? 'Show Unfolded' : 'Unfold' }
        ],
        target: halo.el,
        autoClose: true,
        padding: 30
      });
      const haloThis = this;
      contextToolbar.on('action:In-Zoom', function() {
        this.remove();
        const cellModel = haloThis.options.cellView.model;
        if (cellModel.attributes.attrs.ellipse['stroke-width'] === 4) {
          options.graphService.changeGraphModel(cellModel.id, options.treeViewService, 'inzoom');
        } else {
          cellModel.attributes.attrs.ellipse['stroke-width'] = 4;
          const CellClone = cellModel.clone();
          const textString = cellModel.attributes.attrs.text.text;
          CellClone.set('id', cellModel.id);
          CellClone.attr({text: {text: textString}});
          CellClone.set('position', cellModel.get('position'));
          options.treeViewService.insertNode(cellModel, 'inzoom');
          const elementlinks = options.graphService.graphLinks;

          processInzooming(evt, x, y, haloThis.options, CellClone, elementlinks);
          options.opmModel.inZoom(cellModel.id);
        }
        options.treeViewService.treeView.treeModel.getNodeById(cellModel.id).toggleActivated();
      });
      contextToolbar.on('action:Unfold', function() {
        this.remove();
        const cellModel = haloThis.options.cellView.model;
        if (cellModel.attributes.attrs.ellipse['stroke'] === '#FF0000') {
          options.graphService.changeGraphModel(cellModel.id, options.treeViewService, 'unfold');
        } else {
          cellModel.attributes.attrs.ellipse['stroke'] = '#FF0000';
          const CellClone = cellModel.clone();
          const textString = cellModel.attributes.attrs.text.text;
          CellClone.set('id', cellModel.id);
          CellClone.attr({text: {text: textString}});
          options.treeViewService.insertNode(cellModel, 'unfold');
          const elementlinks = options.graphService.graphLinks;

          haloThis.graph.addCell(CellClone);
          haloThis.graph.addCells(elementlinks);
          processUnfolding(haloThis.options, CellClone, elementlinks);
        }
        options.treeViewService.treeView.treeModel.getNodeById(cellModel.id).toggleActivated();
      });
      contextToolbar.render();
    });
  }
  updateProcessSize() {
    let leftSideX = this.get('position').x;
    let topSideY = this.get('position').y;
    let rightSideX = this.get('position').x + this.get('size').width;
    let bottomSideY = this.get('position').y + this.get('size').height;

    const elps = joint.g.ellipse.fromRect(this.getBBox());
    _.each(this.getEmbeddedCells(), function(child) {

      const childBbox = child.getBBox();
      // Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object

      if (!elps.containsPoint(childBbox.bottomLeft())) {
        bottomSideY = bottomSideY + paddingObject;
        leftSideX = leftSideX - paddingObject;
      }
      if (!elps.containsPoint(childBbox.origin())) {
        topSideY = topSideY - paddingObject ;
        leftSideX = leftSideX - paddingObject;
      }
      if (!elps.containsPoint(childBbox.corner())) {
        bottomSideY = bottomSideY + paddingObject;
        rightSideX = rightSideX + paddingObject;
      }
      if (!elps.containsPoint(childBbox.topRight())) {
        topSideY = topSideY - paddingObject ;
        rightSideX = rightSideX + paddingObject;
      }
    });
    this.set({
      position: { x: leftSideX, y: topSideY },
      size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }}, {skipExtraCall: true});
  }
}
