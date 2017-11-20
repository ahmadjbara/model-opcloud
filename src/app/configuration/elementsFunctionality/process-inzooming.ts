import {OpmProcess} from '../../models/DrawnPart/OpmProcess';
import {OpmState} from '../../models/DrawnPart/OpmState';
import {ResultLink} from '../../models/DrawnPart/Links/ResultLink';
import {ConsumptionLink} from '../../models/DrawnPart/Links/ConsumptionLink';
import {OpmDefaultLink} from '../../models/DrawnPart/Links/OpmDefaultLink';
import {linkDrawing} from '../../configuration/elementsFunctionality/linkDrawing';
import {OpmObject} from "../../models/DrawnPart/OpmObject";
import {GeneralizationLink} from '../../models/DrawnPart/Links/GeneralizationLink';
import {ExhibitionLink} from "../../models/DrawnPart/Links/ExhibitionLink";
import {AggregationLink} from "../../models/DrawnPart/Links/AggregationLink";
import {InstantiationLink} from "../../models/DrawnPart/Links/InstantiationLink";
import {linkType} from "../../models/ConfigurationOptions";
import {TriangleClass} from "../../models/DrawnPart/Links/OpmFundamentalLink";

const joint = require('rappid');
const initial_subprocess_inzooming = 3;
const Facotr = 0.8;
const inzoomed_height = 200;
const inzoomed_width = 300;
const x_margin = 70;
const y_margin = 10; // height margin between subprocess
const childMargin = 55;


export function processInzooming (evt, x, y, options, cellRef, links) {



  // var options = _this.options;
  const parentObject = cellRef;

  parentObject.set('padding', 100);


  // options.graph.addCell(parentObject);

  // console.log(links);
  // options.graph.addCells(links);


  parentObject.attributes.attrs.text['ref-y'] = .1;
  parentObject.attributes.attrs.text['ref-x'] = .5;
  parentObject.attributes.attrs.text['text-anchor'] = 'middle';
  parentObject.attributes.attrs.text['y-alignment'] = 'top';

  // parentObject.attributes.attrs.text({refx:'30%'});
  // zoom out current elements in the paper
  const cells = cellRef.graph.getElements();
  for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const cell = cells[cellIndex];
    if (!(cell instanceof OpmState)) {
      const cellSize = cell.get('size');
      cell.resize(cellSize.width * Facotr, cellSize.height * Facotr);
    }
  }

  // end of zoom out

  // resize the in-zoomed process
  parentObject.resize(inzoomed_height, inzoomed_width, options);

  // create the initial subprcoess
  let dy = y_margin;

  for (let i = 0; i < initial_subprocess_inzooming; i++) {
    const yp = y + dy + 50;
    const xp = x + childMargin;
    // let defaultProcess = new joint.shapes.opm.Process(basicDefinitions.defineShape('ellipse'));
    let defaultProcess = new OpmProcess();
    defaultProcess.set('position', {x: xp, y: yp});
    parentObject.embed(defaultProcess);     // makes the state stay in the bounds of the object
    options.graph.addCells([parentObject, defaultProcess]);
    dy += x_margin;
    // console.log('child object2'+JSON.stringify(defaultProcess));
  }

  parentObject.updateProcessSize();
  parentObject.set('statesHeightPadding', 180);



  // parentObject.embeds
  const EmbeddedCells = parentObject.getEmbeddedCells();
  const first_process_id = EmbeddedCells[0].id;
  const last_process_id = EmbeddedCells[(initial_subprocess_inzooming - 1)].id;


  options.graph.getConnectedLinks(parentObject, { inbound: true }).forEach(function(link) {
    if (link instanceof ConsumptionLink) {
      link.set('target', {id: first_process_id}, {cameFromInZooming: true});
      // Ahmad: I don't like this solution. For now it solves the problem of navigating
      // between OPDs when there is a consumption link. Need to find where is a circular pointer created in the code.
      link.attributes.graph = null;
    }
  });

  options.graph.getConnectedLinks(parentObject, { outbound: true}).forEach(function(link) {
    if (link instanceof ResultLink) {
      link.set('source', {id: last_process_id});
    }
  });
  options.graph.on('change:position change:size', function (cell, value, opt) {


    if (opt.cameFrom === 'textEdit') {
      const maxWidth = opt.wd > value.width ? opt.wd : value.width;
      const maxHeight = opt.hg > value.height ? opt.hg : value.height;
      cell.resize(maxWidth, maxHeight);
      return;
    }
    cell.set('originalSize', cell.get('size'));
    cell.set('originalPosition', cell.get('position'));
    const parentId = cell.get('parent');
    if (parentId) {
      const parent = options.graph.getCell(parentId);
      if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
      if (cell.attributes.attrs.wrappingResized) {
        parent.updateSizeToFitEmbeded();
        return;
      }
      if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));
      if (parent instanceof OpmProcess) {
        parent.updateProcessSize();
        console.log(cell);
      }

    } else if (cell.get('embeds') && cell.get('embeds').length) {
      // if (cell.attributes.attrs.wrappingResized){
      //  common.CommonFunctions.updateSizeToFitEmbeded(cell);
      //  return;
      // }

      cell.updateSizeToFitEmbeded();
    }
  });
}

export function processUnfolding (options, cellRef, unfoldingOptions) {

  let x = cellRef.get('position').x;
  x = getRightmostXCoord(cellRef, options.graph) + 20;
  let y = cellRef.get('position').y + 160;

  for (var prop in unfoldingOptions) {

    console.log(prop);
    if (unfoldingOptions[prop] === false || linkAlreadyExist(cellRef, prop, options))
      continue;
    console.log(prop);
    for (let i = 0; i < 2; i++) {

      let defaultProcess;
      if (prop === 'Exhibition-Characterization-Attributes')
        defaultProcess = new OpmObject();
      else
        defaultProcess = new OpmProcess();
      defaultProcess.set('position', {x: x, y: y});
      options.graph.addCell(defaultProcess);

      let link;
      linkDrawing.drawLinkSilent(options.graph, prop, cellRef, defaultProcess);

      x = x + defaultProcess.get('size').width + 20;

    }
  }
}
function linkAlreadyExist(cellRef, prop, options){
  let links = options.graph.getConnectedLinks(cellRef);
  for (let k=0; k<links.length; k++) {
    console.log(links[k].attributes.OpmLinkType==="ExhibitionLink");
    console.log(prop.includes('Attribues'));
    console.log(linkHasAttribute(links[k], options.graph));
    if (links[k].attributes.OpmLinkType==="ExhibitionLink" && prop.includes('Attributes') && linkHasAttribute(links[k], options.graph))
      return true;
    else if (links[k].attributes.OpmLinkType==="ExhibitionLink" && prop.includes('Operations') && linkHasOperation(links[k], options.graph))
      return true;
    else if (links[k].attributes.OpmLinkType==="GeneralizationLink" && prop.includes('Generalization'))
      return true;
    else if (links[k].attributes.OpmLinkType==="AggregationLink" && prop.includes('Aggregation'))
      return true;
    else if (links[k].attributes.OpmLinkType==="InstantiationLink" && prop.includes('Instantiation'))
      return true;
  }
  return false;
}
function linkHasAttribute(link, graph){
  if (link.getTargetElement() instanceof  TriangleClass){
    let links = graph.getConnectedLinks(link.getTargetElement());
    for (let k=0; k<links.length; k++)
      if (links[k].getTargetElement() instanceof OpmObject)
        return true;
  }
  return false;
}
function linkHasOperation(link, graph){
  if (link.getTargetElement() instanceof  TriangleClass){
    let links = graph.getConnectedLinks(link.getTargetElement());
    for (let k=0; k<links.length; k++)
      if (links[k].getTargetElement() instanceof OpmProcess)
        return true;
  }
  return false;
}
export function getRightmostXCoord(cellRef, graph){
  let x = 0;
  let links = graph.getConnectedLinks(cellRef);
  if (typeof links === "undefined")
    return 0;
  for (let k=0; k< links.length; k++)
    if (links[k].getTargetElement() instanceof TriangleClass){
    let lowerLinks = graph.getConnectedLinks(links[k].getTargetElement());
    if (typeof links === "undefined")
        return 0;
    for (let i=0; i<lowerLinks.length; i++)
      if (lowerLinks[i].getTargetElement().getBBox().corner().x > x){
      x = lowerLinks[i].getTargetElement().getBBox().corner().x;
      }
    }
    else {
      if (links[k].getTargetElement().getBBox().corner().x > x) {
        x = links[k].getTargetElement().getBBox().corner().x;
      }
    }
    console.log(x);
    return x;
}
