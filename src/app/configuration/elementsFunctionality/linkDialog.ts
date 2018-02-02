//import {GenerateOPLs} from './linkTypeSelection';
import { oplFunctions} from '../../opl-generation/opl-functions';


const joint = require('rappid');

// Options - init-rappid service

export function createDialog(options, link ) {
  const dialogComponentRef = {
    type: 'choose-link',
    instance: {
      newLink: link,
      linkSource: link.getSourceElement(),
      linkTarget: link.getTargetElement(),
      opmLinks: oplFunctions.generateLinksWithOpl(link),
      Structural_Links: [],
      Agent_Links: [],
      Instrument_Links: [],
      Effect_links: [],
      Consumption_links: [],
      Result_Link: [],
      Invocation_links: [],
      Exception_links: [],
      Relation_Links: [],
      In_out_Link_Pair: [],
    }
  };
  console.log(dialogComponentRef.instance.opmLinks);


  for (const link of dialogComponentRef.instance.opmLinks) {

    // in_out_link
    if(link.name === 'In/out_linkPair'){
      dialogComponentRef.instance.In_out_Link_Pair.push(link);
    }
    // Relation Links
    else if(link.name === 'Unidirectional_Relation'
      || link.name === 'Bidirectional_Relation')
    {
      dialogComponentRef.instance.Relation_Links.push(link)}
    // Structural Links
    else if (link.name === 'Aggregation-Participation'
      || link.name === 'Generalization-Specialization'
      || link.name === 'Exhibition-Characterization'
      || link.name === 'Classification-Instantiation') {

      dialogComponentRef.instance.Structural_Links.push(link);
    } else if (link.name === 'Agent' || link.name === 'Event_Agent' || link.name === 'Condition_Agent') {
      // Agent Links
      dialogComponentRef.instance.Agent_Links.push(link);
    } else if (link.name === 'Instrument' || link.name === 'Condition_Instrument' || link.name === 'Event_Instrument') {
      // Instrument links
      dialogComponentRef.instance.Instrument_Links.push(link);
    } else if (link.name === 'Condition_Effect' || link.name === 'Event_Effect' || link.name === 'Effect') {
      // Effect links
      dialogComponentRef.instance.Effect_links.push(link);
      dialogComponentRef.instance.Effect_links.reverse();
    } else if (link.name === 'Consumption' || link.name === 'Condition_Consumption' || link.name === 'Event_Consumption') {
      // Consumption links
      dialogComponentRef.instance.Consumption_links.push(link);
    } else if (link.name === 'Result') {
      // Result
      dialogComponentRef.instance.Result_Link.push(link);
    } else if (link.name === 'Invocation') {
      // Invocation
      dialogComponentRef.instance.Invocation_links.push(link);
    } else if (link.name === 'Overtime_exception'
      || link.name === 'Undertime_exception'
      || link.name === 'OvertimeUndertime-exception') {
      // Exception Links
      dialogComponentRef.instance.Exception_links.push(link);
    }
  }

  options.dialog$.next(dialogComponentRef);
  return dialogComponentRef;
}

