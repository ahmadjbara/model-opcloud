import * as common from "../common/commonFunctions";
import {OpmProcess} from "../models/DrawnPart/OpmProcess";
import {OpmState} from "../models/DrawnPart/OpmState";

const joint = require('rappid');
const initial_subprocess=3;
const Facotr=0.8;
const inzoomed_height=200;
const inzoomed_width=300;
const x_margin=70;
const y_margin=10;//height margin between subprocess
const childMargin=67;


export function processInzooming (evt, x, y, options, cellRef, links) {



  //var options = _this.options;
  var parentObject=cellRef;

  parentObject.set('padding',100);

  options.graph.addCell(parentObject);

  options.graph.addCells(links);

  parentObject.attributes.attrs.text['ref-y']=.1;
  parentObject.attributes.attrs.text['ref-x']=.5;
  parentObject.attributes.attrs.text['text-anchor']='middle';
  parentObject.attributes.attrs.text['y-alignment']='top';

   //parentObject.attributes.attrs.text({refx:'30%'});
  //zoom out current elements in the paper
  var cells = options.graph.getElements();
  for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    var cell = cells[cellIndex];
    if (!(cell instanceof OpmState)) {
      var cellSize = cell.get('size');
      cell.resize(cellSize.width * Facotr, cellSize.height * Facotr);
    }
  }

  //end of zoom out

  // resize the in-zoomed process
  parentObject.resize(inzoomed_height, inzoomed_width, options);

  //create the initial subprcoess
   let dy=y_margin;

  for (let i = 0; i < initial_subprocess; i++) {
    let yp = y + dy;
    let xp=x+childMargin;
    //let defaultProcess = new joint.shapes.opm.Process(basicDefinitions.defineShape('ellipse'));
    let defaultProcess = new OpmProcess();
    defaultProcess.set('position', {x: xp, y: yp});
    parentObject.embed(defaultProcess);     //makes the state stay in the bounds of the object
    options.graph.addCells([parentObject, defaultProcess]);
    dy += x_margin;
    //console.log('child object2'+JSON.stringify(defaultProcess));
  }

  common.CommonFunctions.updateProcessSize(parentObject);
  parentObject.set('statesHeightPadding', 180);



  //parentObject.embeds
  let EmbeddedCells=parentObject.getEmbeddedCells();
  let first_process_id=EmbeddedCells[0].id;
  let last_process_id=EmbeddedCells[(initial_subprocess-1)].id;


   options.graph.getConnectedLinks(parentObject, { inbound: true }).forEach(function(link) {
     if (link.attributes.name === 'Consumption') {
       link.set('target', {id: first_process_id},{cameFromInZooming:true});
       //Ahmad: I don't like this solution. For now it solves the problem of navigating
       // between OPDs when there is a consumption link. Need to find where is a circular pointer created in the code.
       link.attributes.graph = null;
     }
   });

   options.graph.getConnectedLinks(parentObject, { outbound: true}).forEach(function(link) {
     if (link.attributes.name === 'Result') {
       link.set('source', {id: last_process_id});
     }
   });
  options.graph.on('change:position change:size', function (cell, value, opt) {
    if (opt.skipExtraCall)
      return;
    if (opt.cameFrom === 'textEdit') {
    let maxWidth = opt.wd > value.width ? opt.wd : value.width;
    let maxHeight = opt.hg > value.height ? opt.hg : value.height;
    cell.resize(maxWidth, maxHeight);
    return;
  }
    cell.set('originalSize', cell.get('size'));
    cell.set('originalPosition', cell.get('position'));
    var parentId = cell.get('parent');
    if (parentId) {
      var parent = options.graph.getCell(parentId);
      if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
      if (cell.attributes.attrs.wrappingResized){
        parent.updateSizeToFitEmbeded();
        return;
      }
      if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));
       common.CommonFunctions.updateProcessSize(parent);
    }
    else if (cell.get('embeds') && cell.get('embeds').length) {
     // if (cell.attributes.attrs.wrappingResized){
      //  common.CommonFunctions.updateSizeToFitEmbeded(cell);
      //  return;
     // }
      cell.updateSizeToFitEmbeded();
    }
  });
}

export function processUnfolding (_this, cellRef, links) {



  var options = _this.options;
  var parentObject=cellRef;


  options.graph.addCell(parentObject);

  options.graph.addCells(links);
/*
  parentObject.attributes.attrs.text = {
    'ref-y': .1,
    'ref-x': .5,
    'text-anchor': 'middle',
    'y-alignment': 'top'
  };
  */
  //parentObject.attributes.attrs.text({refx:'30%'});
  //zoom out current elements in the paper
 /* var cells = options.graph.getElements();
  for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    var cell = cells[cellIndex];
    if (!(cell instanceof joint.shapes.opm.State)) {
      var cellSize = cell.get('size');
      cell.resize(cellSize.width * Facotr, cellSize.height * Facotr);
    }
  }
*/
  //end of zoom out

  // resize the in-zoomed process
  //parentObject.resize(inzoomed_height, inzoomed_width, options);
/*
  //create the initial subprcoess
  let dy=y_margin;
/*
  for (let i = 0; i < initial_subprocess; i++) {
    let yp = y + dy;
    let xp=x+childMargin;
    let defaultProcess = new joint.shapes.opm.Process(basicDefinitions.defineShape('ellipse'));
    defaultProcess.set('position', {x: xp, y: yp});
    parentObject.embed(defaultProcess);     //makes the state stay in the bounds of the object
    options.graph.addCells([parentObject, defaultProcess]);
    dy += x_margin;
    //console.log('child object2'+JSON.stringify(defaultProcess));
  }
*/
/*
  common.CommonFunctions.updateProcessSize(parentObject);



  //parentObject.embeds
  let EmbeddedCells=parentObject.getEmbeddedCells();
  let first_process_id=EmbeddedCells[0].id;
  let last_process_id=EmbeddedCells[(initial_subprocess-1)].id;


  options.graph.getConnectedLinks(parentObject, { inbound: true }).forEach(function(link) {
    if (link.attributes.name === 'Consumption') {
      link.set('target', {id: first_process_id},{cameFromInZooming:true});
      //Ahmad: I don't like this solution. For now it solves the problem of navigating
      // between OPDs when there is a consumption link. Need to find where is a circular pointer created in the code.
      link.attributes.graph = null;
    }
  });

  options.graph.getConnectedLinks(parentObject, { outbound: true}).forEach(function(link) {
    if (link.attributes.name === 'Result') {
      link.set('source', {id: last_process_id});
    }
  });
  options.graph.on('change:position change:size', function (cell, value, opt) {

    console.log(opt);

    if (opt.skipExtraCall)
      return;

    if (opt.cameFrom === 'textEdit') {
      let maxWidth = opt.wd > value.width ? opt.wd : value.width;
      let maxHeight = opt.hg > value.height ? opt.hg : value.height;
      cell.resize(maxWidth, maxHeight);
      return;
    }

    cell.set('originalSize', cell.get('size'));
    cell.set('originalPosition', cell.get('position'));
    var parentId = cell.get('parent');
    if (parentId) {
      var parent = options.graph.getCell(parentId);
      if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
      if (cell.attributes.attrs.wrappingResized){
        common.CommonFunctions.updateSizeToFitEmbeded(parent);
        return;
      }

      if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));
      common.CommonFunctions.updateProcessSize(parent);
    }
    else if (cell.get('embeds') && cell.get('embeds').length) {
      // if (cell.attributes.attrs.wrappingResized){
      //  common.CommonFunctions.updateSizeToFitEmbeded(cell);
      //  return;
      // }
      common.CommonFunctions.updateSizeToFitEmbeded(cell);
    }

  });
*/
}

