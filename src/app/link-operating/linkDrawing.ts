import {AgentLink} from '../models/DrawnPart/Links/AgentLink';
import {InstrumentLink} from '../models/DrawnPart/Links/InstrumentLink';
import {InvocationLink} from '../models/DrawnPart/Links/InvocationLink';
import {ResultLink} from '../models/DrawnPart/Links/ResultLink';
import {ConsumptionLink} from '../models/DrawnPart/Links/ConsumptionLink';
import {EffectLink} from '../models/DrawnPart/Links/EffectLink';
import {OvertimeExceptionLink} from '../models/DrawnPart/Links/OvertimeExceptionLink';
import {UndertimeExceptionLink} from '../models/DrawnPart/Links/UndertimeExceptionLink';
import {OvertimeUndertimeExceptionLink} from '../models/DrawnPart/Links/OvertimeUndertimeExceptionLink';
import {UnidirectionalTaggedLink} from '../models/DrawnPart/Links/UnidirectionalTaggedLink';
import {BiDirectionalTaggedLink} from '../models/DrawnPart/Links/BiDirectionalTaggedLink';
import {AggregationLink} from '../models/DrawnPart/Links/AggregationLink';
import {ExhibitionLink} from '../models/DrawnPart/Links/ExhibitionLink';
import {GeneralizationLink} from '../models/DrawnPart/Links/GeneralizationLink';
import {InstantiationLink} from '../models/DrawnPart/Links/InstantiationLink';

const joint = require('rappid');

export const linkDrawing = {
  drawLink(link, linkName) {
    console.log('in drawlink');
    const graph = link.graph;
    const isCondition = linkName.includes('Condition');
    const isEvent = linkName.includes('Event');
    let newLink;
    if (linkName.includes('Agent')) {
      newLink = new AgentLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Instrument')) {
      newLink = new InstrumentLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Invocation')) {
      newLink = new InvocationLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Result')) {
      newLink = new ResultLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Consumption')) {
      newLink = new ConsumptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Effect')) {
      newLink = new EffectLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Overtime_exception')) {
      newLink = new OvertimeExceptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Undertime_exception')) {
      newLink = new UndertimeExceptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Undertime_and_overtime_exception')) {
      newLink = new OvertimeUndertimeExceptionLink(link.getSourceElement(), link.getTargetElement(), isCondition, isEvent);
    } else if (linkName.includes('Unidirectional')) {
      newLink = new UnidirectionalTaggedLink(link.getSourceElement(), link.getTargetElement());
    } else if (linkName.includes('Bidirectional')) {
      newLink = new BiDirectionalTaggedLink(link.getSourceElement(), link.getTargetElement());
    } else if (linkName.includes('Aggregation')) {
      newLink = new AggregationLink(link.getSourceElement(), link.getTargetElement(), graph);
    } else if (linkName.includes('Exhibition')) {
      newLink = new ExhibitionLink(link.getSourceElement(), link.getTargetElement(), graph);
    }else if (linkName.includes('Generalization')) {
      newLink = new GeneralizationLink(link.getSourceElement(), link.getTargetElement(), graph);
    }else if (linkName.includes('Instantiation')) {
      newLink = new InstantiationLink(link.getSourceElement(), link.getTargetElement(), graph);
    }
    graph.addCell(newLink);
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
