import {AgentLink} from '../../models/DrawnPart/Links/AgentLink';
import {InstrumentLink} from '../../models/DrawnPart/Links/InstrumentLink';
import {InvocationLink} from '../../models/DrawnPart/Links/InvocationLink';
import {ResultLink} from '../../models/DrawnPart/Links/ResultLink';
import {ConsumptionLink} from '../../models/DrawnPart/Links/ConsumptionLink';
import {EffectLink} from '../../models/DrawnPart/Links/EffectLink';
import {OvertimeExceptionLink} from '../../models/DrawnPart/Links/OvertimeExceptionLink';
import {UndertimeExceptionLink} from '../../models/DrawnPart/Links/UndertimeExceptionLink';
import {OvertimeUndertimeExceptionLink} from '../../models/DrawnPart/Links/OvertimeUndertimeExceptionLink';
import {UnidirectionalTaggedLink} from '../../models/DrawnPart/Links/UnidirectionalTaggedLink';
import {BiDirectionalTaggedLink} from '../../models/DrawnPart/Links/BiDirectionalTaggedLink';
import {AggregationLink} from '../../models/DrawnPart/Links/AggregationLink';
import {ExhibitionLink} from '../../models/DrawnPart/Links/ExhibitionLink';
import {GeneralizationLink} from '../../models/DrawnPart/Links/GeneralizationLink';
import {InstantiationLink} from '../../models/DrawnPart/Links/InstantiationLink';
import {OpmObject} from "../../models/DrawnPart/OpmObject";
import {OpmProcess} from "../../models/DrawnPart/OpmProcess";
import {OpmState} from "../../models/DrawnPart/OpmState";

const joint = require('rappid');

export const linkDrawing = {
  drawLink(link, linkName) {
    console.log('in drawlink');
    const graph = link.graph;
    const isCondition = linkName.includes('Condition');
    const isEvent = linkName.includes('Event');
    const newLink = [];
    if (linkName.includes('Agent')) {
      newLink.push(new AgentLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('Instrument')) {
      newLink.push(new InstrumentLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('Invocation')) {
      newLink.push(new InvocationLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('Result')) {
      newLink.push(new ResultLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('Consumption')) {
      newLink.push(new ConsumptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('Effect')) {
      newLink.push(new EffectLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('Overtime_exception')) {
      newLink.push(new OvertimeExceptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('Undertime_exception')) {
      newLink.push(new UndertimeExceptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('OvertimeUndertime-exception')) {
      newLink.push(new OvertimeUndertimeExceptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
    } else if (linkName.includes('Unidirectional')) {
      newLink.push( new UnidirectionalTaggedLink(link.getSourceElement(), link.getTargetElement()));
    } else if (linkName.includes('Bidirectional')) {
      newLink.push(new BiDirectionalTaggedLink(link.getSourceElement(), link.getTargetElement()));
    } else if (linkName.includes('Aggregation')) {
      newLink.push(new AggregationLink(link.getSourceElement(), link.getTargetElement(), graph));
    } else if (linkName.includes('Exhibition')) {
      newLink.push(new ExhibitionLink(link.getSourceElement(), link.getTargetElement(), graph));
    }else if (linkName.includes('Generalization')) {
      newLink.push( new GeneralizationLink(link.getSourceElement(), link.getTargetElement(), graph));
    }else if (linkName.includes('Instantiation')) {
      newLink.push( new InstantiationLink(link.getSourceElement(), link.getTargetElement(), graph));
    }else if (linkName.includes('In/out_linkPair')) {
      InOutLinkpair(link.getSourceElement(), link.getTargetElement(),newLink, graph , isCondition, isEvent);
    }
 //   newLink[0].set('previousTargetId', link.get('previousTargetId'));
  //  newLink[0].set('previousSourceId', link.get('previousSourceId'));
   // newLink[0].set('name', link.get('name'));
    link.remove();
    graph.addCells(newLink);
/*
    if (ftag && btag) {
      link.set('labels', [ { position: 0.75, attrs: { text: {text: ftag+'\n'}, rect: {fill: 'transparent'} } },
        { position: 0.25, attrs: { text: {text: '\n'+btag}, rect: {fill: 'transparent'} } }
      ]);
    }
    else if (ftag) {
      link.set('labels', [ {  position: 0.75, attrs: { text: {text: ftag+'\n'}, rect: {fill: 'transparent'} } } ]);
    }
*/
  },
  drawLinkSilent(graph, linkName, source, target ,id?:string) {
    const isCondition = linkName.includes('Condition');
    const isEvent = linkName.includes('Event');
    let newLink;
    if (linkName.includes('Agent')) {
      newLink = new AgentLink(source, target, isCondition, isEvent ,id);
    } else if (linkName.includes('Instrument')) {
      newLink = new InstrumentLink(source, target, isCondition, isEvent,id);
    } else if (linkName.includes('Invocation')) {
      newLink = new InvocationLink(source, target, isCondition, isEvent,id);
    } else if (linkName.includes('Result')) {
      newLink = new ResultLink(source, target, isCondition, isEvent,id);
    } else if (linkName.includes('Consumption')) {
      newLink = new ConsumptionLink(source, target, isCondition, isEvent,id);
    } else if (linkName.includes('Effect')) {
      newLink = new EffectLink(source, target, isCondition, isEvent,id);
    } else if (linkName.includes('Overtime_exception')) {
      newLink = new OvertimeExceptionLink(source, target, isCondition, isEvent,id);
    } else if (linkName.includes('Undertime_exception')) {
      newLink = new UndertimeExceptionLink(source, target, isCondition, isEvent,id);
    } else if (linkName.includes('OvertimeUndertime-exception')) {
      newLink = new OvertimeUndertimeExceptionLink(source, target, isCondition, isEvent,id);
    } else if (linkName.includes('Unidirectional')) {
      newLink = new UnidirectionalTaggedLink(source, target,id);
    } else if (linkName.includes('Bidirectional')) {
      newLink = new BiDirectionalTaggedLink(source, target,id);
    } else if (linkName.includes('Aggregation')) {
      newLink = new AggregationLink(source, target, graph,id);
    } else if (linkName.includes('Exhibition')) {
      newLink = new ExhibitionLink(source, target, graph,id);
    }else if (linkName.includes('Generalization')) {
      newLink = new GeneralizationLink(source, target, graph,id);
    }else if (linkName.includes('Instantiation')) {
      newLink = new InstantiationLink(source, target, graph,id);
    }
    graph.addCell(newLink);
  }
};

function InOutLinkpair(source,target,newLink,graph ,  isCondition, isEvent){
  if(source instanceof OpmState){
    const sourceID = source.attributes.father;
    const children  = graph.getCell(sourceID).getEmbeddedCells();
  for(let child=0 ; child<children.length;child++){
    if(children[child].attributes.id === source.attributes.id){
      newLink.push(new ConsumptionLink(source, target,isCondition,isEvent));
      if(children[child+1]){
        newLink.push(new ResultLink(target,graph.getCell(children[child+1].attributes.id), isCondition, isEvent));
      }
      else if(children[child-1]){
        newLink.push(new ResultLink(target,graph.getCell(children[child-1].attributes.id), isCondition, isEvent));
      }
    }
  }
}
if(source instanceof OpmProcess) {
  const targetID = target.attributes.father;
  const children = graph.getCell(targetID).getEmbeddedCells();
  for (let child = 0; child < children.length; child++) {
    if (children[child].attributes.id === target.attributes.id) {
      newLink.push(new ResultLink(source, target, isCondition, isEvent));
      if (children[child + 1]) {
        newLink.push(new ConsumptionLink(graph.getCell(children[child + 1].attributes.id),source, isCondition, isEvent));
      }
      else if (children[child - 1]) {
        newLink.push(new ConsumptionLink(graph.getCell(children[child - 1].attributes.id) ,source, isCondition, isEvent));
      }
    }
  }
}
}
