import {OPXModel} from "./OPX.controller";
import {OpmObject} from "../models/DrawnPart/OpmObject";
import {OpmProcess} from "../models/DrawnPart/OpmProcess";
import {linkDrawing} from "../configuration/elementsFunctionality/linkDrawing";
import {joint, _, vectorizer,} from '../configuration/rappidEnviromentFunctionality/shared';
import {ProgressSpinner} from "../dialogs/Spinner/Progress_Spinner";
import {UnidirectionalTaggedLink} from "../models/DrawnPart/Links/UnidirectionalTaggedLink";
import {BiDirectionalTaggedLink} from "../models/DrawnPart/Links/BiDirectionalTaggedLink";
import {OpmFundamentalLink} from "../models/DrawnPart/Links/OpmFundamentalLink";
import {LinkInstance} from "../models/opx.model/LinkInstance";
import {addHandle} from "../configuration/elementsFunctionality/graphFunctionality";



let counter = 0;

export function importOpxOPDs(opxJson , options ,opxModel ,ServiceGraph, ImportGraph){

  opxModel = new OPXModel(opxJson);
  let JSON;
  let MainGraph = new joint.dia.Graph;
  let opx_objects = opxModel.LogicalObjects;
  let opx_processes = opxModel.LogicalProcesses;
  let opx_Relation_Links = opxModel.RelationLinks;
  let opx_Logical_Links = opxModel.LogicalLinks;
  let opx_InZoomedTree = opxModel.InZoomedTree;
  let opx_UnfoldedTree = opxModel.UnfoldedTree;
  let Inzoomedgraphs = new Map<string,any>();
  let Unfoldedgraphs = new Map<string,any>();
  let InzoomTreeMap = new Map<string,string>();
  let UnfoldTreeMap = new Map<string,string>();
  let objects = new Map<string,any>();
  let processes = new Map<string,any>();
  let MainProcesses = new Map<string,any>();
  let ChildrenContainer = new Map<string,Array<any>>();

// Load Trees (Inzoomed / Unfolded)
 LoadTrees(opx_InZoomedTree,Inzoomedgraphs,InzoomTreeMap);
 LoadTrees(opx_UnfoldedTree,Unfoldedgraphs,UnfoldTreeMap);
 // console.log(Inzoomedgraphs);
 // console.log(Unfoldedgraphs);
 addObjects(opx_objects,MainGraph,objects,options);
 addProcesses(opx_processes,MainGraph,processes,options);

  ServiceGraph.resetCells(MainGraph.getCells());

  for(let obj in opx_objects){
    if(objects.get(opx_objects[obj].id) && opx_objects[obj].instances ){
      let object = objects.get(opx_objects[obj].id);
      let Instances = opx_objects[obj].instances;
      for(let inst in Instances){
        object =  createObject(opx_objects[obj],Instances[inst]);
        if(Inzoomedgraphs.get(Instances[inst].OPD)){
        Inzoomedgraphs.get(Instances[inst].OPD).addCell(object);

          if (opx_objects[obj].States) {
            let States = opx_objects[obj].States;
            for (let s in States) {
              if(States[s].instances){
                let instStates = States[s].instances;
                for(let Sinst in instStates){
                  if(Instances[inst].OPD === instStates[Sinst].OPD && instStates[Sinst].Visible){
                  object.addState_fromData(States[s] ,instStates[Sinst], counter++, Inzoomedgraphs.get(Instances[inst].OPD));
                    object.attributes.attrs.text['ref-y'] = .1;
                    object.attributes.attrs.text['ref-x'] = .5;
                    object.attributes.attrs.text['text-anchor'] = 'middle';
                    object.attributes.attrs.text['y-alignment'] = 'top';
                  }
                }
              }
            }
          }
        }
        if(Unfoldedgraphs.get(Instances[inst].OPD)){
          Unfoldedgraphs.get(Instances[inst].OPD).addCell(object);

          if (opx_objects[obj].States) {
            let States = opx_objects[obj].States;
            for (let s in States) {
              if(States[s].instances) {
                let instStates = States[s].instances;
                for (let Sinst in instStates) {
                  if (Instances[inst].OPD === instStates[Sinst].OPD && instStates[Sinst].Visible) {
                    object.addState_fromData(States[s],instStates[Sinst], counter++, Unfoldedgraphs.get(Instances[inst].OPD));
                    object.attributes.attrs.text['ref-y'] = .1;
                    object.attributes.attrs.text['ref-x'] = .5;
                    object.attributes.attrs.text['text-anchor'] = 'middle';
                    object.attributes.attrs.text['y-alignment'] = 'top';
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  for(let proc in opx_processes){
    if(opx_processes[proc].instances && processes.get(opx_processes[proc].id) ){
      let process = processes.get(opx_processes[proc].id);
      let Instances = opx_processes[proc].instances;
      for(let inst in Instances) {
        process = createProcess(opx_processes[proc], Instances[inst]);
        if (Inzoomedgraphs.get(Instances[inst].OPD)) {
          Inzoomedgraphs.get(Instances[inst].OPD).addCell(process);
        }
        if(Unfoldedgraphs.get(Instances[inst].OPD)){
          Unfoldedgraphs.get(Instances[inst].OPD).addCell(process);
        }
      }
      }
  }
  for(let proc in opx_processes){
    if(opx_processes[proc].instances && processes.get(opx_processes[proc].id) ){
      let process = processes.get(opx_processes[proc].id);
      let Instances = opx_processes[proc].instances;

      for(let inst in Instances){
        let InzoomedGraph = Inzoomedgraphs.get(Instances[inst].OPD);
        if(Instances[inst].MainEntity && InzoomedGraph){
          let father = InzoomedGraph.getCell(process.id);
          MainProcesses.set(Instances[inst].OPD,father);
        }
      }
    }
  }

  MainProcesses.forEach((value: any, key: string) => {
    let children: Array<any> = [];
    children.push(value);
    for (let proc in opx_processes) {
      let Instances = opx_processes[proc].instances;
      if (opx_processes[proc].instances) {
        for (let inst in Instances) {
          if (Instances[inst].OPD === key && Instances[inst].child) {
            children.push(Inzoomedgraphs.get(key).getCell(opx_processes[proc].id));

          }
        }
      }
    }

    for(let obj in opx_objects){
      if(opx_objects[obj].instances){
        let Instances = opx_objects[obj].instances;
        for(let inst in Instances){
          if(Instances[inst].OPD === key &&Instances[inst].child){
            children.push(Inzoomedgraphs.get(key).getCell(opx_objects[obj].id));
          }
        }
      }
    }
    ChildrenContainer.set(key,children);
  });


  for(let proc in opx_processes){
    let Instances = opx_processes[proc].instances;
    if (opx_processes[proc].instances) {
      for (let inst in Instances) {
        if (Instances[inst].child && Inzoomedgraphs.get(Instances[inst].OPD) ) {
          let process_name = opx_processes[proc].name.replace('\n',' ') + ' in-zoomed';
          if (Inzoomedgraphs.get(process_name)) {
            let child_cell = Inzoomedgraphs.get(Instances[inst].OPD).getCell(opx_processes[proc].id);
            child_cell.attributes.attrs.ellipse['stroke-width'] = 4;

          }
        }
      }
    }
  }
 /* console.log(Inzoomedgraphs);
  console.log(ChildrenContainer);*/
  Inzoomedgraphs.forEach((valueGraph: any, keyOPD: string) => {
    let children = ChildrenContainer.get(keyOPD.toString());
    if(children) {
      if (valueGraph.getCell(children[0].id)) {

        const fatherPosition = children[0].get('position');
        children[0].attributes.attrs.text['ref-y'] = .1;
        children[0].attributes.attrs.text['ref-x'] = .5;
        children[0].attributes.attrs.text['text-anchor'] = 'middle';
        children[0].attributes.attrs.text['y-alignment'] = 'top';
        children[0].toBack();
        for (let child = 1; child < children.length; child++) {
          children[0].embed(children[child]);
          children[child].set('father', children[0].get('id'));
          const childPosition = children[child].get('position');
          children[child].set('position', {
            x: childPosition.x + fatherPosition.x,
            y: childPosition.y + fatherPosition.y
          });
          if (children[child].getEmbeddedCells() && children[child] instanceof OpmObject) {
            let embeds = children[child].getEmbeddedCells();
            for (let emb in embeds) {
              let embposition = embeds[emb].get('position');
              embeds[emb].set('position', {x: embposition.x + fatherPosition.x, y: embposition.y + fatherPosition.y});

            }
          }
          children[0].updateProcessSize();
        }
        children[0].updateProcessSize();
      }
    }
  });


  for(let link in opx_Relation_Links){
    let linkname = opx_Relation_Links[link].name;
      if (ServiceGraph.getCell(opx_Relation_Links[link].source_id) &&
        ServiceGraph.getCell(opx_Relation_Links[link].destination_id)&&
        opx_Relation_Links[link].InRoot) {
        linkDrawing.drawLinkSilent(ServiceGraph,linkname,
          ServiceGraph.getCell(opx_Relation_Links[link].source_id),
          ServiceGraph.getCell(opx_Relation_Links[link].destination_id),opx_Relation_Links[link].id);
        let linkCell = ServiceGraph.getCell(opx_Relation_Links[link].id);
        UpdateLinkLayout(linkCell,opx_Relation_Links[link],true);
      }


    Inzoomedgraphs.forEach((value: any, key: string) => {
          let Instances = opx_Relation_Links[link].instances;
          if(Instances) {
            for (let inst in Instances) {
              if (Instances[inst].OPD === key) {
                if (Instances[inst].Visible) {
                  if (value.getCell(Instances[inst].source_id) &&
                    value.getCell(Instances[inst].destination_id)) {
                    linkDrawing.drawLinkSilent(value, linkname,
                      value.getCell(Instances[inst].source_id),
                      value.getCell(Instances[inst].destination_id),opx_Relation_Links[link].id)

                    let linkCell = value.getCell(opx_Relation_Links[link].id);
                    UpdateLinkLayout(linkCell,opx_Relation_Links[link],false ,Instances[inst]);
                  }

                }
              }
            }
          }
        });

    Unfoldedgraphs.forEach((value: any, key: string) => {
      let Instances = opx_Relation_Links[link].instances;
      if(Instances) {
        for (let inst in Instances) {
          if (Instances[inst].OPD === key) {
            if (Instances[inst].Visible) {
              if (value.getCell(Instances[inst].source_id) &&
                value.getCell(Instances[inst].destination_id)) {
                linkDrawing.drawLinkSilent(value, linkname,
                  value.getCell(Instances[inst].source_id),
                  value.getCell(Instances[inst].destination_id),opx_Relation_Links[link].id)
                let linkCell = value.getCell(opx_Relation_Links[link].id);
                UpdateLinkLayout(linkCell,opx_Relation_Links[link],false,Instances[inst]);
              }
            }
          }
        }
      }
    });

  }


  for(let link in opx_Logical_Links){
    let linkname = opx_Logical_Links[link].name;
      if (ServiceGraph.getCell(opx_Logical_Links[link].source_id) &&
        ServiceGraph.getCell(opx_Logical_Links[link].destination_id)&&
        opx_Logical_Links[link].InRoot) {
        linkDrawing.drawLinkSilent(ServiceGraph, linkname,
          ServiceGraph.getCell(opx_Logical_Links[link].source_id),
          ServiceGraph.getCell(opx_Logical_Links[link].destination_id),opx_Logical_Links[link].id)
        let linkCell = ServiceGraph.getCell(opx_Logical_Links[link].id);
        UpdateLinkLayout(linkCell,opx_Logical_Links[link],true);
      }
    Inzoomedgraphs.forEach((value: any, key: string) => {
        let Instances = opx_Logical_Links[link].instances;
        if(Instances) {
          for (let inst in Instances) {
            if (Instances[inst].OPD === key) {
              if (Instances[inst].Visible) {
                if (value.getCell(Instances[inst].source_id) &&
                  value.getCell(Instances[inst].destination_id)) {
                  linkDrawing.drawLinkSilent(value, linkname,
                    value.getCell(Instances[inst].source_id),
                    value.getCell(Instances[inst].destination_id),opx_Logical_Links[link].id)
                  let linkCell = value.getCell(opx_Logical_Links[link].id);
                  UpdateLinkLayout(linkCell,opx_Logical_Links[link],false,Instances[inst]);
                }
              }
            }
          }
        }
      });

    Unfoldedgraphs.forEach((value: any, key: string) => {
      let Instances = opx_Logical_Links[link].instances;
      if(Instances) {
        for (let inst in Instances) {
          if (Instances[inst].OPD === key) {
            if (Instances[inst].Visible) {
              if (value.getCell(Instances[inst].source_id) &&
                value.getCell(Instances[inst].destination_id)) {
                linkDrawing.drawLinkSilent(value, linkname,
                  value.getCell(Instances[inst].source_id),
                  value.getCell(Instances[inst].destination_id),opx_Logical_Links[link].id)
                let linkCell = value.getCell(opx_Logical_Links[link].id);
                UpdateLinkLayout(linkCell,opx_Logical_Links[link],false,Instances[inst]);
              }
            }
          }
        }
      }
    });
    }


  ImportGraph.resetCells(ServiceGraph.getCells());
/*
  console.log(opx_objects);
  console.log(opx_processes);
  console.log(opx_Relation_Links);
  console.log(opx_Logical_Links);
  console.log(opx_InZoomedTree);
  console.log(objects);
  console.log(processes);
  console.log(Inzoomedgraphs);
  console.log(Unfoldedgraphs);
  console.log(InzoomTreeMap);*/
  Inzoomedgraphs.forEach((value: any, key: string) => {
    options.getTreeView().fromImport(InzoomTreeMap.get(key),key,value,'inzoom');
  });
  Unfoldedgraphs.forEach((value: any, key: string) => {
    options.getTreeView().fromImport(UnfoldTreeMap.get(key),key,value,'unfold');
  });
 /* console.log(ServiceGraph)
  console.log(ImportGraph);*/
}

function createObject(object,instance?){
  let Object = new OpmObject();
  if(!instance){
     Object.fromData(0,object.name,object.id,
     object.width,
     object.height,
     object.x,
     object.y,
      0,0,'opm.Object',counter++,object.physical,object.enviromental);
     return Object;
  }
  else{
    Object.fromData(0,object.name,object.id,
      instance.width,
      instance.height,
      instance.x,
      instance.y,
      0,0,'opm.Object',counter++,object.physical,object.enviromental);
    return Object;
  }
}
function createProcess(process,instance?) {
  let Process = new OpmProcess();
  if (!instance) {
    Process.fromData(0, process.name, process.id,
      process.width,
      process.height,
      process.x,
      process.y,
      0, 0, 'opm.Process',
      counter++, process.physical, process.enviromental);
    return Process
  }
  else {
    Process.fromData(0, process.name, process.id,
      instance.width,
      instance.height,
      instance.x,
      instance.y,
      0, 0, 'opm.Process',
      counter++, process.physical, process.enviromental);
    return Process
  }
}

function LoadTrees(opxTree,graphMap,TreeMap){
  for(let tree in opxTree){
    if(opxTree[tree].children){
      let children = opxTree[tree].children;
      for(let child = 0;child < children.length ;child ++ ){
        let Name = children[child].$.name.trim();
        graphMap.set(Name,new joint.dia.Graph);
        TreeMap.set(Name,opxTree[tree].parentName);
      }
    }
  }
}

function addObjects(opx_objects,Graph,objects,options){
  for(let obj in opx_objects){
    let object = createObject(opx_objects[obj]);
    if(opx_objects[obj].InRoot) {
      Graph.addCell(object);

      if (opx_objects[obj].States) {
        let States = opx_objects[obj].States;
        for (let s in States) {
          if(States[s].InRoot) {
            object.addState_fromData(States[s],null, counter++, Graph);
            object.attributes.attrs.text['ref-y'] = .01;
            object.attributes.attrs.text['ref-x'] = .5;
            object.attributes.attrs.text['text-anchor'] = 'middle';
            object.attributes.attrs.text['y-alignment'] = 'top';
          }
          }
      }
    }
    objects.set(opx_objects[obj].id,object);
  }
}

function addProcesses(opx_processes,Graph,processes,options){
  for(let proc in opx_processes){

    let process = createProcess(opx_processes[proc]);
    if(opx_processes[proc].InRoot ){
      Graph.addCell(process);
      for(let inst in opx_processes[proc].instances){
        if(opx_processes[proc].instances[inst].MainEntity){
          Graph.getCell(opx_processes[proc].id).attributes.attrs.ellipse['stroke-width'] = 4;
        }
      }
    }
    processes.set(opx_processes[proc].id,process);
  }
}
function UpdateLinkLayout(linkCell,opx_Link,MainGraph:boolean , instance ?: LinkInstance){

  if(MainGraph){
    if(opx_Link.breakPoints) {
      let Vertices: Array<any> = [];
      for (let point in opx_Link.breakPoints) {
        Vertices.push({x: opx_Link.breakPoints[point].x, y: opx_Link.breakPoints[point].y});
      }
        linkCell.set('vertices', [...Vertices]);
        Vertices = [];
    }
  }

  else{
    if(instance.breakPoints){
      let Vertices: Array<any> = [];
      for (let point in instance.breakPoints) {
        Vertices.push({x: instance.breakPoints[point].x, y: instance.breakPoints[point].y});
      }
      linkCell.set('vertices', [...Vertices]);
      Vertices = [];
    }
  }

  if(linkCell instanceof UnidirectionalTaggedLink && opx_Link.forwardRelationMeaning ){
    linkCell.prop(['labels',0, 'attrs','text','text'],opx_Link.forwardRelationMeaning);
  }
  if(linkCell instanceof BiDirectionalTaggedLink ){
    if(opx_Link.forwardRelationMeaning ){
      linkCell.prop(['labels',0, 'attrs','text','text'],opx_Link.forwardRelationMeaning);
    }
    if(opx_Link.backwardRelationMeaning){
      linkCell.prop(['labels',1, 'attrs','text','text'],opx_Link.backwardRelationMeaning);
    }
  }
  if(linkCell instanceof OpmFundamentalLink){
    if(MainGraph) {
      if (opx_Link.trianglePosition) {
        linkCell.getTriangle().set('position', {x: opx_Link.trianglePosition.x, y: opx_Link.trianglePosition.y});
      }
    }
    else{
      if(instance.trianglePosition){
        linkCell.getTriangle().set('position', {x: instance.trianglePosition.x, y: instance.trianglePosition.y});
      }
    }
  }
}

