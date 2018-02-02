import {OpmFundamentalRelation} from '../../models/LogicalPart/OpmFundamentalRelation';
import {OpmFundamentalLink, TriangleClass} from '../../models/DrawnPart/Links/OpmFundamentalLink';
import {OpmTaggedRelation} from '../../models/LogicalPart/OpmTaggedRelation';
import {OpmProceduralRelation} from '../../models/LogicalPart/OpmProceduralRelation';
import {OpmLogicalState} from '../../models/LogicalPart/OpmLogicalState';
import {OpmLogicalProcess} from '../../models/LogicalPart/OpmLogicalProcess';
import {OpmState} from '../../models/DrawnPart/OpmState';
import {OpmProceduralLink} from '../../models/DrawnPart/Links/OpmProceduralLink';
import {OpmTaggedLink} from '../../models/DrawnPart/Links/OpmTaggedLink';
import {OpmProcess} from '../../models/DrawnPart/OpmProcess';
import {OpmLogicalObject} from '../../models/LogicalPart/OpmLogicalObject';
import {OpmObject} from '../../models/DrawnPart/OpmObject';
import {OpmDefaultLink} from "../../models/DrawnPart/Links/OpmDefaultLink";
import {AgentLink} from "../../models/DrawnPart/Links/AgentLink";
import {InstrumentLink} from "../../models/DrawnPart/Links/InstrumentLink";
import {InstantiationLink} from "../../models/DrawnPart/Links/InstantiationLink";
import {GeneralizationLink} from "../../models/DrawnPart/Links/GeneralizationLink";
import {ExhibitionLink} from "../../models/DrawnPart/Links/ExhibitionLink";
import {AggregationLink} from "../../models/DrawnPart/Links/AggregationLink";
import {BiDirectionalTaggedLink} from "../../models/DrawnPart/Links/BiDirectionalTaggedLink";
import {UnidirectionalTaggedLink} from "../../models/DrawnPart/Links/UnidirectionalTaggedLink";
import {OvertimeUndertimeExceptionLink} from "../../models/DrawnPart/Links/OvertimeUndertimeExceptionLink";
import {UndertimeExceptionLink} from "../../models/DrawnPart/Links/UndertimeExceptionLink";
import {OvertimeExceptionLink} from "../../models/DrawnPart/Links/OvertimeExceptionLink";
import {EffectLink} from "../../models/DrawnPart/Links/EffectLink";
import {ConsumptionLink} from "../../models/DrawnPart/Links/ConsumptionLink";
import {ResultLink} from "../../models/DrawnPart/Links/ResultLink";
import {InvocationLink} from "../../models/DrawnPart/Links/InvocationLink";
import {textWrapping} from "./textWrapping";


export function addHandle(initRappidService, cell, opt) {
  if (opt.stencil) {
    initRappidService.cell$.next(cell);
  }
  if (cell instanceof OpmObject) {
    initRappidService.opmModel.add(new OpmLogicalObject(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmProcess) {
    initRappidService.opmModel.add(new OpmLogicalProcess(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmState) {
    initRappidService.opmModel.add(new OpmLogicalState(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmProceduralLink) {
    initRappidService.opmModel.add(new OpmProceduralRelation(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmTaggedLink) {
    initRappidService.opmModel.add(new OpmTaggedRelation(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmFundamentalLink) {
    initRappidService.opmModel.add(new OpmFundamentalRelation(cell.getParams(), initRappidService.opmModel));
  }
}
export function removeHandle(initRappidService, cell) {
  initRappidService.opmModel.remove(cell.id);

}
export function changeHandle(initRappidService, cell) {
  if (cell.constructor.name === 'TriangleClass') {
    updateFundamentalLinkFromTriengle(cell, initRappidService.opmModel);
  } else if (cell.constructor.name === 'OpmDefaultLink') {
    if (cell.getTargetElement() instanceof TriangleClass) {
      updateFundamentalLinkFromTriengle(cell.getTargetElement(), initRappidService.opmModel);
    }
  } else {
    const params = cell.getParams();
    const logicalElement = initRappidService.opmModel.getLogicalElementByVisualId(cell.get('id'));
    const visualElement = initRappidService.opmModel.getVisualElementById(cell.get('id'));
    if (logicalElement) logicalElement.updateParams(params);
    if (visualElement)  visualElement.updateParams(params);
  }
}
function updateFundamentalLinkFromTriengle(triangleCell, opmModel) {
  const outboundLinks = triangleCell.graph.getConnectedLinks(triangleCell, { outbound: true });
  for (let i = 0; i < outboundLinks.length; i++) {
    const params = outboundLinks[i].getParams();
    const visualElement = opmModel.getVisualElementById(outboundLinks[i].get('id'));
    if (visualElement)  visualElement.updateParams(params);
  }
}
export function createDrawnEntity(type) {
  if (type.includes('Object')) {
    return new OpmObject();
  } else if (type.includes('Process')) {
    return new OpmProcess();
  } else if (type.includes('State')) {
    return new OpmState();
  }
}
export function createDrawnLink(source, target, isCondition = null, isEvent = null, linkName, graph) {
  if (linkName.includes('Agent')) {
    return new AgentLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('Instrument')) {
    return new InstrumentLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('Invocation')) {
    return new InvocationLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('Result')) {
    return new ResultLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('Consumption')) {
    return new ConsumptionLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('Effect')) {
    return new EffectLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('Overtime')) {
    return new OvertimeExceptionLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('Undertime')) {
    return new UndertimeExceptionLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('UndertimeOvertimeException')) {
    return new OvertimeUndertimeExceptionLink(source, target, isCondition, isEvent);
  } else if (linkName.includes('Unidirectional')) {
    return  new UnidirectionalTaggedLink(source, target);
  } else if (linkName.includes('Bidirectional')) {
    return new BiDirectionalTaggedLink(source, target);
  } else if (linkName.includes('Aggregation')) {
    return new AggregationLink(source, target, graph);
  } else if (linkName.includes('Exhibition')) {
    return new ExhibitionLink(source, target, graph);
  }else if (linkName.includes('Generalization')) {
    return  new GeneralizationLink(source, target, graph);
  }else if (linkName.includes('Instantiation')) {
    return  new InstantiationLink(source, target, graph);
  }
}

// fix embed elements from data
export function FixEmbeds_FromData(graph){

  for(let cell of graph.getCells()){

    if(cell.get('father')){
      let fatherID = cell.get('father')
      let father = graph.getCell(fatherID);
      if(cell instanceof OpmState){
        textWrapping.wrapTextAfterSizeChange(cell);
        father.embed(cell);
        cell.set('parent',fatherID);
        father.updateSizeToFitEmbeded();
      }
      father.embed(cell);
    }
  }

}
