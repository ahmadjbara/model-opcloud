/**
 * Created by ta2er on 8/18/2017.
 */

import {LogicalEntity} from "../models/opx.model/LogicalEntity";
import {RelationLinks,Position} from "../models/opx.model/RelationLinks";
import {LogicalState} from "../models/opx.model/LogicalStates";
import {InzoomedTree} from "../models/opx.model/InzoomedTree";
import {ThingInstance} from "../models/opx.model/ThingInstance";
import {LinkInstance} from "../models/opx.model/LinkInstance";
import {UnfoldedTree} from "../models/opx.model/UnfoldedTree";



export class OPXModel {
  private LogicalStructure: string;
  private VisualPart: string;
  private ThingSection: any;
  private LinkSection : any;
  private FundamentalRelationSection : any;
  private GeneralRelationSection : any;
  private OPD: any;
  private _InZoomedTree: Array<InzoomedTree> = [];
  private _UnfoldedTree: Array<UnfoldedTree> = []
  private _LogicalObjects: Array<LogicalEntity> = [];
  private _LocicalStates: Array<LogicalState> = [];
  private _LogicalProcesses: Array<LogicalEntity> = [];
  private _ChildrenContainer: Array<LogicalEntity> = [];
  private _LogicalLinks: Array<RelationLinks> = [];
  private _RelationLinks: Array<RelationLinks> = [];
  private size: number = 0;
  private states_size = 0;
  private ThingInstances: Array<ThingInstance> = [];
  private LinkInstances: Array<LinkInstance> = [];
  private StateInstances:Array<ThingInstance> = [];


  constructor(json_opx: string) {
    json_opx = JSON.stringify(json_opx);
    let json = JSON.parse(json_opx);
    this.LogicalStructure = json.OPX.OPMSystem[0].LogicalStructure;
    this.VisualPart = json.OPX.OPMSystem[0].VisualPart[0];
    this.OPD = json.OPX.OPMSystem[0].VisualPart[0].OPD[0];
    this.ThingSection = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].ThingSection[0];
    this.LinkSection = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].VisualLinkSection[0];
    this.FundamentalRelationSection = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].FundamentalRelationSection[0];
    this.GeneralRelationSection = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].GeneralRelationSection[0];
    this.load_Inzoomed_sections(json);
    this.load_Unfolded_sections(json);
    this.load_object_section(this.LogicalStructure);
    this.load_Process_section(this.LogicalStructure);
    this.load_Link_section(this.LogicalStructure);
    this.load_Relation_section(this.LogicalStructure);
  }


  //-----------------------------------------------Loaders--------------------------------------------------------------

  private load_Inzoomed_sections(json) {
    let Root = this.OPD;
    let Inzoomed = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].InZoomed[0].OPD;

   this.traverse(Root,Inzoomed);
 //  console.log(this._InZoomedTree);
  }

  private load_Unfolded_sections(json) {
    let Root = this.OPD;
    let UnfoldedSet = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].Unfolded[0].UnfoldingProperties;
    let index = 0;
    if (UnfoldedSet) {
      for (let item in UnfoldedSet) {
        let Unfolded = UnfoldedSet[item].OPD;
        if (Unfolded) {
          this._UnfoldedTree.push(new UnfoldedTree(Root.$.id, Root.$.name, Unfolded));
        }
      }
    }
  //  console.log(this._UnfoldedTree);
  }


  private handleThingInstances(Instances, VThing, id) {
    let opd_Name;
    for (let i = 0; i < Instances.length; i++) {
      opd_Name = Instances[i].$.name;

      for (let tree of this.InZoomedTree) {
        let Layout = tree.getLayout(opd_Name, VThing, id);
        if (Layout) {
          opd_Name = this.handleOPDName(opd_Name);
          this.ThingInstances.push(new ThingInstance(opd_Name, parseInt(Layout.data.x),
            parseInt(Layout.data.y),
            parseInt(Layout.data.width),
            parseInt(Layout.data.height), Layout.MainEntity, Layout.child))
        }
      }

      for (let tree of this.UnfoldedTree) {
        let Layout = tree.getLayout(opd_Name, VThing, id);
        if (Layout) {
          opd_Name = this.handleOPDName(opd_Name);
          this.ThingInstances.push(new ThingInstance(opd_Name, parseInt(Layout.data.x),
            parseInt(Layout.data.y),
            parseInt(Layout.data.width),
            parseInt(Layout.data.height), Layout.MainEntity, Layout.child))
        }
      }
    }
    return this.ThingInstances
  }


  private handleLinkInstances(Instances, id, IsFundamental) {
    let opd_Name;
    for (let i = 0; i < Instances.length; i++) {
      opd_Name = Instances[i].$.name;
      for (let tree of this.InZoomedTree) {
        if (IsFundamental) {
          let Layout = tree.getRelationLayout(opd_Name, id);
          if (Layout) {
            opd_Name = this.handleOPDName(opd_Name);
            if(Layout.type === 'Fundamental'){
            this.LinkInstances.push(new LinkInstance(opd_Name, Layout.dataSource.sourceId,
              Layout.dataTarget.destinationId, Layout.dataTarget.visible === 'true',
              OPXModel.VisualFundamentalRelationSection(Layout.dataVisual,id),null));
            }
              if(Layout.type === 'General'){
                this.LinkInstances.push(new LinkInstance(opd_Name, Layout.dataSource.sourceId,
                  Layout.dataTarget.destinationId,true,null
                  ,OPXModel.VisualGeneralRelationSection(Layout.dataVisual,id)));
              }
          }

        }
        else {
          let Layout = tree.getLinkLayout(opd_Name, id);
          if (Layout) {
            opd_Name = this.handleOPDName(opd_Name);
            this.LinkInstances.push(new LinkInstance(opd_Name, Layout.data.sourceId, Layout.data.destinationId, true,null,
              OPXModel.VisualLinkSection(Layout.dataVisual,id)));
          }
        }
      }

      for (let tree of this.UnfoldedTree) {
        if (IsFundamental) {
          let Layout = tree.getRelationLayout(opd_Name, id);
          if (Layout) {
            opd_Name = this.handleOPDName(opd_Name);
            if(Layout.type === 'Fundamental'){
              this.LinkInstances.push(new LinkInstance(opd_Name, Layout.dataSource.sourceId,
                Layout.dataTarget.destinationId, Layout.dataTarget.visible === 'true',
                OPXModel.VisualFundamentalRelationSection(Layout.dataVisual,id),null
                ));}
            if(Layout.type === 'General'){
              this.LinkInstances.push(new LinkInstance(opd_Name, Layout.dataSource.sourceId,
                Layout.dataTarget.destinationId,true ,null,
                OPXModel.VisualGeneralRelationSection(Layout.dataVisual,id)
                ));
            }
          }

        }
        else {
          let Layout = tree.getLinkLayout(opd_Name, id);
          if (Layout) {
            opd_Name = this.handleOPDName(opd_Name);
            this.LinkInstances.push(new LinkInstance(opd_Name, Layout.data.sourceId, Layout.data.destinationId, true,
              null,OPXModel.VisualLinkSection(Layout.dataVisual,id)
              ));
          }
        }
      }

    }
    return this.LinkInstances;
  }

  private handleStateInstances(Instances, VThing, Objid ,stateID) {
    let OPDName;
    if(Instances){
      for(let inst in Instances){
        OPDName = Instances[inst].$.name;
        for (let tree of this.InZoomedTree) {
          let Layout = tree.getLayout(OPDName, VThing, Objid);

          if (Layout) {
            OPDName = this.handleOPDName(OPDName);
            for(let state in Layout.data) {
              if (Layout.data[state].InstanceAttr[0].$.entityId === stateID) {
                let visual = Layout.data[state].ConnectionEdgeAttr[0].$;
                this.StateInstances.push(new ThingInstance(OPDName,
                  parseInt(visual.x),
                  parseInt(visual.y),
                  parseInt(visual.width),
                  parseInt(visual.height),Layout.MainEntity, Layout.child, Layout.data[state].$.visible === 'true'))
              }
            }
          }
        }

        for (let tree of this.UnfoldedTree) {
          let Layout = tree.getLayout(OPDName, VThing, Objid);

          if (Layout) {
            OPDName = this.handleOPDName(OPDName);
            for(let state in Layout.data) {
              if (Layout.data[state].InstanceAttr[0].$.entityId === stateID) {
                let visual = Layout.data[state].ConnectionEdgeAttr[0].$;
                this.StateInstances.push(new ThingInstance(OPDName, parseInt(visual.x),
                  parseInt(visual.y),
                  parseInt(visual.width),
                  parseInt(visual.height), Layout.MainEntity, Layout.child, Layout.data[state].$.visible === 'true'))
              }
            }
          }
        }

      }
    }
    return this.StateInstances;
  }


  private load_object_section(LogicalStructure) {

    let EntityAttr;
    let EntityInstance;
    let OPMProperties;
    let visualprobs;
    let state_EntityAttr;
    let state_OPMProperties;
    let state_visualprobs;
    let state_Instances;
    if (LogicalStructure[0].ObjectSection[0].LogicalObject) {
      this.size = parseInt(LogicalStructure[0].ObjectSection[0].LogicalObject.length);

      if (OPXModel.CheckSize(this.size)) {
        for (let i = 0; i < this.size; i++) {
          this.ThingInstances = [];
          this.StateInstances = [];
          EntityAttr = LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].$;
          EntityInstance = LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].EntityInstances[0].instance;
          OPMProperties = LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].OPMProperties[0].Property;
          visualprobs = OPXModel.thingSectionObject(this.ThingSection, EntityAttr.id);

          if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState) {
            this.states_size = parseInt(LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState.length);

            for (let j = 0; j < this.states_size; j++) {
              let Initial = false;
              let Final = false;
              let Defualt = false;
              if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].$) {
                if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].$.initial) {

                  Initial = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].$.initial === 'true'
                }
                if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].$.final) {
                  Final = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].$.final === 'true'
                }
                if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].$.default) {
                  Defualt = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].$.default === 'true'
                }
              }
              state_EntityAttr = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].EntityAttr[0].$;
              state_Instances = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].EntityAttr[0].EntityInstances[0].instance
              state_OPMProperties = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].EntityAttr[0].OPMProperties[0].Property;
              state_visualprobs = OPXModel.thingSectionState(this.ThingSection, EntityAttr.id, state_EntityAttr.id);
              if (state_OPMProperties[0].$.value !== 'Exsistent' && state_OPMProperties[0].$.value !== 'Non-Exsistent') {
                this._LocicalStates.push(new LogicalState(state_EntityAttr.id, state_EntityAttr.uuid,
                  state_OPMProperties[0].$.value, state_OPMProperties[1].$.value, state_OPMProperties[2].$.value,
                  parseInt(state_visualprobs.x),
                  parseInt(state_visualprobs.y),
                  parseInt(state_visualprobs.width),
                  parseInt(state_visualprobs.height),
                  Defualt, Final, Initial,
                  this.handleStateInstances(state_Instances,'VisualState',EntityAttr.id,state_EntityAttr.id),
                  state_visualprobs != ''
                  ))

              }
              this.StateInstances = [];
            }



            this._LogicalObjects.push(new LogicalEntity(EntityAttr.id, EntityAttr.uuid,
              OPMProperties[0].$.value, OPMProperties[1].$.value, OPMProperties[2].$.value,
              parseInt(visualprobs.x),
              parseInt(visualprobs.y),
              parseInt(visualprobs.width),
              parseInt(visualprobs.height), this._LocicalStates, this.handleThingInstances(EntityInstance, 'VisualObject', EntityAttr.id)
            ));
            this._LocicalStates = [];


          } else {
            EntityAttr = LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].$;
            OPMProperties = LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].OPMProperties[0].Property;
            visualprobs = OPXModel.thingSectionObject(this.ThingSection, EntityAttr.id);
            this._LogicalObjects.push(new LogicalEntity(EntityAttr.id, EntityAttr.uuid,
              OPMProperties[0].$.value, OPMProperties[1].$.value, OPMProperties[2].$.value,
              parseInt(visualprobs.x),
              parseInt(visualprobs.y),
              parseInt(visualprobs.width),
              parseInt(visualprobs.height), null, this.handleThingInstances(EntityInstance, 'VisualObject', EntityAttr.id)
            ));
            this._LocicalStates = [];

          }


        }
      }
    }

  }

  private load_Process_section(LogicalStructure) {
    let EntityInstance;
    let EntityAttr;
    let OPMProperties;
    let visualprobs;
    if (LogicalStructure[0].ProcessSection[0].LogicalProcess) {
      this.size = parseInt(LogicalStructure[0].ProcessSection[0].LogicalProcess.length);

      if (OPXModel.CheckSize(this.size)) {
        for (let i = 0; i < this.size; i++) {
          this.ThingInstances = [];
          EntityAttr = LogicalStructure[0].ProcessSection[0].LogicalProcess[i].EntityAttr[0].$;
          EntityInstance = LogicalStructure[0].ProcessSection[0].LogicalProcess[i].EntityAttr[0].EntityInstances[0].instance;
          OPMProperties = LogicalStructure[0].ProcessSection[0].LogicalProcess[i].EntityAttr[0].OPMProperties[0].Property;
          visualprobs = OPXModel.thingSectionProcess(this.ThingSection, EntityAttr.id);

          this._LogicalProcesses.push(new LogicalEntity(EntityAttr.id, EntityAttr.uuid,
            OPMProperties[1].$.value, OPMProperties[3].$.value, OPMProperties[4].$.value,
            parseInt(visualprobs.x),
            parseInt(visualprobs.y),
            parseInt(visualprobs.width),
            parseInt(visualprobs.height), null, this.handleThingInstances(EntityInstance, 'VisualProcess', EntityAttr.id)
          ))
          ;
        }


      }
    }

  }

  private load_Link_section(LogicalStructure) {
    let LogicRelations;
    let EntityAttr;
    let OPMProperties;
    let EntityInstance;
    if (LogicalStructure[0].LinkSection[0].LogicalLink) {
      this.size = parseInt(LogicalStructure[0].LinkSection[0].LogicalLink.length);

      if (OPXModel.CheckSize(this.size)) {
        for (let i = 0; i < this.size; i++) {
          this.LinkInstances = [];
          LogicRelations = LogicalStructure[0].LinkSection[0].LogicalLink[i].$;
          EntityAttr = LogicalStructure[0].LinkSection[0].LogicalLink[i].EntityAttr[0].$;
          OPMProperties = LogicalStructure[0].LinkSection[0].LogicalLink[i].EntityAttr[0].OPMProperties[0].Property;
          EntityInstance = LogicalStructure[0].LinkSection[0].LogicalLink[i].EntityAttr[0].EntityInstances[0].instance;

          this._LogicalLinks.push(new RelationLinks(EntityAttr.id, EntityAttr.uuid,
            OPXModel.handleLinkname(OPMProperties[0].$.value), LogicRelations.sourceId,
            LogicRelations["source-uuid"], LogicRelations.destinationId,
            LogicRelations["destination-uuid"], null,null,
            this.handleLinkInstances(EntityInstance, EntityAttr.id, false),
            null,OPXModel.VisualLinkSection(this.LinkSection,EntityAttr.id),
            OPXModel.VisualLinkInRoot(this.LinkSection,EntityAttr.id)));

        }
      }
    }
  }

  private load_Relation_section(LogicalStructure) {
    let LogicRelations;
    let EntityAttr;
    let OPMProperties;
    let EntityInstance;
    if (LogicalStructure[0].RelationSection[0].LogicalRelation) {
      this.size = parseInt(LogicalStructure[0].RelationSection[0].LogicalRelation.length);

      if (OPXModel.CheckSize(this.size)) {
        for (let i = 0; i < this.size; i++) {
          this.LinkInstances = [];
          LogicRelations = LogicalStructure[0].RelationSection[0].LogicalRelation[i].$;
          EntityAttr = LogicalStructure[0].RelationSection[0].LogicalRelation[i].EntityAttr[0].$;
          OPMProperties = LogicalStructure[0].RelationSection[0].LogicalRelation[i].EntityAttr[0].OPMProperties[0].Property;
          EntityInstance = LogicalStructure[0].RelationSection[0].LogicalRelation[i].EntityAttr[0].EntityInstances[0].instance;

          this._RelationLinks.push(new RelationLinks(EntityAttr.id, EntityAttr.uuid,
            OPXModel.handleLinkname(OPMProperties[0].$.value), LogicRelations.sourceId,
            LogicRelations["source-uuid"], LogicRelations.destinationId,
            LogicRelations["destination-uuid"], LogicRelations.forwardRelationMeaning,
            LogicRelations.backwardRelationMeaning,
            this.handleLinkInstances(EntityInstance, EntityAttr.id, true),
            OPXModel.VisualFundamentalRelationSection(this.FundamentalRelationSection,EntityAttr.id),
            OPXModel.VisualGeneralRelationSection(this.GeneralRelationSection,EntityAttr.id),
            OPXModel.VisualRelationInRoot(this.FundamentalRelationSection,this.GeneralRelationSection,EntityAttr.id)));

        }

      }
    }

  }


  //------------------------------thingSectionsHandlers------------------------------------------------------------

  private static thingSectionObject(ThingSection, id) {
    let size = parseInt(ThingSection.VisualThing.length);
    for (let i = 0; i < size; i++) {
      if (ThingSection.VisualThing[i].ThingData[0].VisualObject) {
        if (ThingSection.VisualThing[i].ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === id) {
          return ThingSection.VisualThing[i].ThingData[0].VisualObject[0].ConnectionEdgeAttr[0].$;
        }
      }
    }
    return '';
  }

  private static thingSectionState(ThingSection, idObj, id) {
    let size = parseInt(ThingSection.VisualThing.length);
    for (let i = 0; i < size; i++) {
      if (ThingSection.VisualThing[i].ThingData[0].VisualObject) {
        if (ThingSection.VisualThing[i].ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === idObj) {
          if (ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState) {
            let state_size = parseInt(ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState.length);
            for (let s = 0; s < state_size; s++) {
              if (ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState[s].$.visible === 'true' &&
                ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState[s].InstanceAttr[0].$.entityId === id) {
                return ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState[s].ConnectionEdgeAttr[0].$;
              }
            }
          }
        }
      }
    }
    return ''

  }

  private static thingSectionProcess(ThingSection, id) {
    let size = parseInt(ThingSection.VisualThing.length);
    for (let i = 0; i < size; i++) {
      if (ThingSection.VisualThing[i].ThingData[0].VisualProcess) {
        if (ThingSection.VisualThing[i].ThingData[0].VisualProcess[0].InstanceAttr[0].$.entityId === id) {
          return ThingSection.VisualThing[i].ThingData[0].VisualProcess[0].ConnectionEdgeAttr[0].$;
        }
      }
    }
    return '';
  }

   private static VisualLinkSection(VisualLinkSection,id){
    if(VisualLinkSection) {
      let size = parseInt(VisualLinkSection.VisualLink.length);
      let BreakPoints: Array<Position> = [];
      for (let i = 0; i < size; i++) {
        if (VisualLinkSection.VisualLink[i].InstanceAttr[0].$.entityId === id) {
          if (VisualLinkSection.VisualLink[i].BreakPoints) {
            let points = VisualLinkSection.VisualLink[i].BreakPoints[0].Point;
            for (let point in points) {
              BreakPoints.push(new Position(parseInt(points[point].$.x), parseInt(points[point].$.y)));
            }
            return BreakPoints
          }
        }
      }
    }
  }

   private static VisualFundamentalRelationSection(FundamentalRelationSection,id){
     if(FundamentalRelationSection) {
       let size = parseInt(FundamentalRelationSection.CommonPart.length);
       for (let i = 0; i < size; i++) {
         if (FundamentalRelationSection.CommonPart[i].VisualFundamentalRelation[0].InstanceAttr[0].$.entityId === id) {
           return new Position(parseInt(FundamentalRelationSection.CommonPart[i].$.x),
             parseInt(FundamentalRelationSection.CommonPart[i].$.y));
         }
       }
     }
  }

  private static VisualGeneralRelationSection(GeneralRelationSection,id){
     if(GeneralRelationSection) {
       let size = parseInt(GeneralRelationSection.VisualGeneralRelation.length);
       let BreakPoints: Array<Position> = [];
       for (let i = 0; i < size; i++) {
         if (GeneralRelationSection.VisualGeneralRelation[i].InstanceAttr[0].$.entityId === id) {
           if (GeneralRelationSection.VisualGeneralRelation[i].BreakPoints) {
             let points = GeneralRelationSection.VisualGeneralRelation[i].BreakPoints[0].Point;
             for (let point in points) {
               BreakPoints.push(new Position(parseInt(points[point].$.x),
                 parseInt(points[point].$.y)));
             }
             return BreakPoints;
           }
         }
       }
     }
  }

  // -----------------------------------------checkInRoot ---------------------------------------------------


  private static VisualLinkInRoot(VisualLinkSection,id){
    if(VisualLinkSection) {
      let size = parseInt(VisualLinkSection.VisualLink.length);
      for (let i = 0; i < size; i++) {
        if (VisualLinkSection.VisualLink[i].InstanceAttr[0].$.entityId === id) {
          return true;
        }
      }
    }
    return false;
  }


  private static VisualRelationInRoot(FundamentalRelationSection,GeneralRelationSection,id) {
    if (FundamentalRelationSection) {
      let size1 = parseInt(FundamentalRelationSection.CommonPart.length);
      for (let i = 0; i < size1; i++) {
        if (FundamentalRelationSection.CommonPart[i].VisualFundamentalRelation[0].InstanceAttr[0].$.entityId === id) {
          return true;
        }
      }
    }
    if (GeneralRelationSection) {
      let size2 = parseInt(GeneralRelationSection.VisualGeneralRelation.length);
      for (let i = 0; i < size2; i++) {
        if (GeneralRelationSection.VisualGeneralRelation[i].InstanceAttr[0].$.entityId === id) {
          return true;
        }
      }
    }
    return false;
  }


//-----------------------------------------------helpers----------------------------------------------------------




  private traverse(Root,Inzoomed) {
    for (let i in Inzoomed) {
      if (!!Inzoomed[i]) {
        let children: Array<string> = [];
        for (let child = 0; child < Inzoomed.length; child++) {
          children.push(Inzoomed[child]);
        }
        if(this.checkExist(this._InZoomedTree,Root.$.id)){
        this._InZoomedTree.push(new InzoomedTree(Root.$.id, Root.$.name, children));
        }

        this.traverse(Inzoomed[i],Inzoomed[i].InZoomed[0].OPD)

      }

    }

  }

  private checkExist(treeSet,parentid){
    for(let node in treeSet){
      if(treeSet[node].getParentID() === parentid){
        return false;
      }
    }
    return true;
  }
  private handleOPDName(opd_Name) {
    opd_Name = opd_Name.substring(opd_Name.indexOf("(") + 1);
    opd_Name = opd_Name.substring(opd_Name.indexOf(":") + 1);
    opd_Name = opd_Name.substring(0, opd_Name.indexOf(")"));
    opd_Name = opd_Name.trim();
    return opd_Name;
  }
  private static handleLinkname(linkname) {
    linkname = linkname.replace(/[0-9]/g, '');

    linkname = linkname.replace('UniDirectionalRelation', 'Unidirectional');
    linkname = linkname.replace('BiDirectionalRelation', 'Bidirectional');
    linkname = linkname.replace('Featuring', 'Exhibition');
    linkname = linkname.replace('Condition', 'ConditionInstrument');
    linkname = linkname.replace('Event', 'EventInstrument');
    linkname = linkname.replace('Instantination','Instantiation')

    return linkname.toString();
  }

  private static CheckSize(size) {
    return size > 0;
  }


//---------------------------getters/setters-------------------------------------------------------------------
  get LogicalObjects(): Array<LogicalEntity> {
    return this._LogicalObjects;
  }

  get LogicalProcesses(): Array<LogicalEntity> {
    return this._LogicalProcesses;
  }

  get LogicalStates(): Array<LogicalState> {
    return this._LocicalStates;
  }

  get LogicalLinks(): Array<RelationLinks> {
    return this._LogicalLinks;
  }
  get InZoomedTree(): Array<InzoomedTree> {
    return this._InZoomedTree;
  }
  get UnfoldedTree(): Array<UnfoldedTree> {
    return this._UnfoldedTree;
  }
  get RelationLinks(): Array<RelationLinks> {
    return this._RelationLinks;
  }
}
