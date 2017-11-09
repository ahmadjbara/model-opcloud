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

const joint = require('rappid');

export const linkDrawing = {
  drawLink(link, linkName) {
    console.log('in drawlink');
    const graph = link.graph;
    const isCondition = linkName.includes('Condition');
    const isEvent = linkName.includes('Event');
    let newLink = [];
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
    } else if (linkName.includes('UndertimeOvertimeException')) {
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
      const parentID = link.getSourceElement().attributes.father;
      if (newLink.length > 1) {
        newLink.push(new ConsumptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent));
        newLink.push(new ResultLink(link.getTargetElement(), graph.getCell(graph.getCell(parentID).attributes.embeds[1]), isCondition, isEvent));
      }
    }
    newLink[0].set('previousTargetId', link.get('previousTargetId'));
    newLink[0].set('previousSourceId', link.get('previousSourceId'));
    newLink[0].set('name', link.get('name'));
    graph.addCells(newLink);
    link.remove();
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
  }
};
