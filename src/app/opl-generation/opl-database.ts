import {Affiliation, Essence} from "../models/ConfigurationOptions";

export * from '../models/ConfigurationOptions';

export const language = { current: 'en', available: ['en', 'cn', 'swe', 'fr']}

export let defaultAffiliation = Affiliation.Systemic;
export let defaultEssence = Essence.Informatical;


export const defaultTable =  {
  'O1-O2': {
    'Aggregation-Participation': `<O1> consist of <O2>.`,
    'Bidirectional_Relation_(tag)': `<O1> and <O2> are <tag>.`,
    'Unidirectional_Relation': `<O1> relates to <O2>.`,
    'Bidirectional_Relation': `<O1> and <O2> are equivalent.`,
    'Generalization-Specialization': `<O2> is a <O1>.`,
    'Classification-Instantiation': `<O2> is an instance of <O1>.`,
    'Bidirectional_Relation_(ftag,btag)': `<O1> <forward tag> <O2> and <O2> <backward tag> <O1>.`,
    'Exhibition-Characterization': `<O1> exhibits <O2>.`},
  'P1-P2': {
    'Undertime_exception': `<P2> occurs if <P1> falls short of <mintime> <units>.`,
    'Aggregation-Participation': `<P1> consist of <P2>.`,
    'Bidirectional_Relation_(tag)': `<P1> and <P2> are <forward tag>.`,
    'UndertimeOvertimeException':
      `<P2> occurs if <P1> falls short of <mintime> <units> or lasts more than <maxtime> <units>.`,
    'Unidirectional_Relation': `<P1> relates to <P2>.`,
    'Invocation': `<P1> invokes <P2>.`,
    'Overtime_exception': `<P2> occurs if <P1> lasts more than <maxtime> <units>.`,
    'Bidirectional_Relation': `<P1> and <P2> are equivalent.`,
    'Generalization-Specialization': `<P2>is a <P1>.`,
    'Classification-Instantiation': `<P2> is an instance of <P1>.`,
    'Unidirectional_Relation_(tag)': `<P1> <tag> <P2>.`,
    'Bidirectional_Relation_(ftag,btag)': `<P1> <forward tag> <P2> and <P2> <backward tag> <P1>.`,
    'Exhibition-Characterization': `<P1> exhibits <P2>.`},
  'P1-P1 (same process)': {
    'Invocation': `<P1> invokes itself.`},
  'O-P': {
    'Condition_Agent': `<P> occurs if <O> exists, otherwise <P>  is skipped.`,
    'Consumption': `<P> consumes <O>.`,
    'Event_Consumption': `<O> initiates <P>, which consumes <O>.`,
    'Instrument': `<P> requires <O>.`,
    'Condition_Instrument': `<P> occurs if <O> exists, otherwise <P>  is skipped.`,
    'Event_Instrument': `<O> initiates <P>, which requires <O>.`,
    'Agent': `<O> handles <P>.`,
    'Event_Agent': `<O> initiates and handles<P>.`,
    'Condition_Consumption': `<P> occurs if <O> exists, in which case<P>  consumes <O>, otherwise <P>  is skipped.`,
    'Exhibition-Characterization': `<O> exhibits <P>.`,
   },
  'P-O': {
    'Exhibition-Characterization': `<P> exhibits <O>.`,
    'Result': `<P> yields <O>.`,
    'Effect': `<P> affects <O>.`,
    'Condition_Effect': `<P> occurs if <O> exists, in which case<P>  affects <O>, otherwise <P>  is skipped.`,
    'Event_Effect': `<O> initiates <P>, which affects <O>`
  },

  'Os-(P)-O (from object state to the same object)': {
    'Overtime_exception': `<O> triggers <P> when <O> is <s> more than <maxtime> <units>, in which case <P> changes <O>.`,
    'Condition_Input ': `<P> occurs if <O> is <s>, in which case <P> changes <O> from <s> , otherwise <P>  is skipped.`,
    'In/out_linkPair': `<P> changes <O> from <s>.`},
  'O1s-O2': {
    'Bidirectional_Relation_(tag)': `<s> <O1> and <O2> are <forward tag>.`,
    'Unidirectional_Relation': `<s> <O1> relates to <O2>.`,
    'Bidirectional_Relation': `<s> <O1> and <O2> are equivalent.`,
    'Unidirectional_Relation_(tag)': `<s> <O1> <tag> <O2>.`,
    'Bidirectional_Relation_(ftag,btag)': `<s> <O1>  <forward tag> <O2> and <O2> <backward tag> <s> <O1>.`,
    'Exhibition-Characterization': `<s> <O1> exhibits <O2>.`},
  'P-Os': {
    'Split_output': `<P> changes <O> to <s>.`,
    'Exhibition-Characterization': `<P> exhibits <s> <O>.`,
    'Result': `<P> yields <s> <O>.`},
  'O1s1-O2s2': {
    'Unidirectional_Relation': `<s1> <O1> relates to <s2> <O2>.`,
    'Bidirectional_Relation_(tag)': `<s1> <O1> and <s2> <O2> are <forward tag>.`,
    'Bidirectional_Relation_(ftag,btag)': `<s1> <O1> <forward tag> <s2><O2> and <s2><O2> <backward tag><s1> <O1>.`,
    'Bidirectional_Relation': `<s1> <O1> and <s2> <O2> are equivalent.`,
    'Unidirectional_Relation_(tag)': `<s1> <O1> <tag> <s2> <O2>.`},
  'O1-O2..n (n>=2 many destinations)': {
    'Aggregation-Participation': `<O1> consist of <O2.1>, <O2.2>, ... and <O2.n>.`,
    'Unidirectional_Relation': `<O1> relates to <O2.1>, <O2.2>, ... and <O2.n>.`,
    'Generalization-Specialization': `<O2.1>, <O2.2>, ... and <O2.n> are <O1>.`,
    'Classification-Instantiation': `<O2.1>, <O2.2>, ... and <O2.n> are instances of <O1>.`,
    'Unidirectional_Relation_(tag)': `<O1> <tag> <O2.1>, <O2.2>, ... and <O2.n>.`,
    'Exhibition-Characterization': `<O1> exhibits<O2.1>, <O2.2>, ... and <O2.n>.`},
  'O1-O2s': {
    'Bidirectional_Relation_(tag)': `<O1> and <s> <O2> are <forward tag>.`,
    'Unidirectional_Relation': `<O1> relates to <s> <O2>.`,
    'Bidirectional_Relation': `<O1> and <s> <O2> are equivalent.`,
    'Unidirectional_Relation_(tag)': `<O1> <tag> <s> <O2>.`,
    'Bidirectional_Relation_(ftag,btag)': `<O1> <forward tag> <s><O2> and <s><O2> <backward tag> to  <O1>.`,
    'Exhibition-Characterization': `<O1> exhibits <s><O2>.`},
  'Os1-(P)-Os2 (same object)': {
    'Overtime_exception':
      `<O> triggers <P> when <O> is <s1> more than <maxtime> <units>, in which case <P> changes <o> to <s2>.`,
    'Condition_Input ': `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P>  is skipped.`,
    'In/out_linkPair': `<P> changes <O> from <s1> to <s2>.`},
  'Os-P': {
    'Agent': `<s> <O> handles <P>.`,
    'Condition_Agent': `<P> occurs if <O> is <s>, otherwise <P> is skipped.`,
    'Event_Agent': `<s> <O> initiates and handles<P>.`,

    'Consumption': `<P> consumes <s> <O>.`,
    'Condition_Consumption': `<P> occurs if <O> is at state <s>, in which case <P> consumes <O>, otherwise <P> is skipped.`,
    'Event_Consumption': `<s> <O> initiates <P>, which consumes <O>.`,

    'Split_input': `<P> changes <O> from  <s>.`,

    'Instrument': `<P> requires <s> <O>.`,
    'Condition_Instrument': `<P> occurs if <O> is at state <s>, otherwise <P> is skipped.`,
    'Event_Instrument': `<s> <O> initiates <P>, which requires <s> <O>.`,

    'Overtime_exception': `<O> triggers <P> when <O> is <s> more than <maxtime> <units>.`,
    'Undertime_exception': `<O> triggers <P> when <O> is <s> less than <mintime> <units>.`,
    'UndertimeOvertimeException': `<O> triggers <P> when <O> is <s> more than <maxtime> <units> and less than <mintime> <units>.`,
    'Exhibition-Characterization': `<s> <O> exhibits <P>.`}
};

export const defaultTable_cn = {
  'O1-O2': {
    'Aggregation-Participation': `<O1>包含<O2>。`,
    'Bidirectional_Relation_(tag)': `<O1>和<O2>是<tag>。`,
    'Unidirectional_Relation': `<O1>与<O2>相关。`,
    'Bidirectional_Relation': `<O1>和<O2>等价。`,
    'Generalization-Specialization': `<O2>是一个<O1>。`,
    'Classification-Instantiation': `<O2>是<O1>的一个实例。`,
    'Bidirectional_Relation_(ftag,btag)': `<O1> <forward tag> <O2>并且<O2> <backward tag> <O1>。`,
    'Exhibition-Characterization': `<O1>展示<O2>.`
  },
}

export const defaultEntityOpl = {
  'en': {
    'object': '<object> is <'
  }
}



export const linkTypes = {
  'en': {
    'Unidirectional_Relation': 'Unidirectional Relation',
    'Unidirectional_Relation_(tag)': 'Unidirectional Relation (tag)',
    'Bidirectional_Relation': 'Bidirectional Relation',
    'Bidirectional_Relation_(tag)': 'Bidirectional Relation (tag)',
    'Bidirectional_Relation_(ftag,btag)': 'Bidirectional Relation (forward tag, backward tag)',
    'Aggregation-Participation': 'Aggregation-Participation',
    'Exhibition-Characterization': 'Exhibition-Characterization',
    'Generalization-Specialization': 'Generalization-Specialization',
    'Classification-Instantiation': 'Classification-Instantiation',
    'Result': 'Result',
    'Consumption': 'Consumption',
    'Effect': 'Effect',
    'Agent': 'Agent',
    'Instrument': 'Instrument',
    'In/out_linkPair': 'In-out link pair',
    'Split_input': 'split input',
    'Split_output': 'split output',
    'Invocation': 'Invocation',
    'Overtime_exception': 'Overtime exception <maxtime, unit>',
    'Undertime_exception': 'Undertime exception<mintime,unit>',
    'UndertimeOvertimeException': 'Undertime and overtime exception <mintime..maxtime, unit>',
    'Condition_Consumption': 'Condition Consumption',
    'Condition_Effect': 'Condition Effect',
    'Condition_Input': 'Condition Input',
    'Condition_Instrument': 'Condition Instrument',
    'Condition_Agent': 'Condition Agent',
    'Event_Consumption': 'Event Consumption',
    'Event_Effect': 'Event Effect',
    'Event_Input': 'Event Input',
    'Event_Instrument': 'Event Instrument',
    'Event_Agent': 'Event Agent'
  }
}


export const defaultTable_fr =  {
  'O1-O2': {
    'Aggregation-Participation': `<O1> consiste en <O2>.`,
    'Bidirectional_Relation_(tag)': `<O1> et <O2> sont <tag>.`,
    'Unidirectional_Relation': `<O1> concerne <O2>.`,
    'Bidirectional_Relation': `<O1> et <O2> sont équivalents.`,
    'Generalization-Specialization': `<O2> est un <O1>.`,
    'Classification-Instantiation': `<O2> est une instance de <O1>.`,
    'Bidirectional_Relation_(ftag,btag)': `<O1> <balise avant> <O2> et <O2> <balise arrière> <O1>.`,
    'Exhibition-Characterization': `<O1> présente <O2>.`},
  'P1-P2': {
    'Undertime_exception': `<P2> occurs if <P1> falls short of <mintime> <units>.`,
    'Aggregation-Participation': `<P1> consist of <P2>.`,
    'Bidirectional_Relation_(tag)': `<P1> and <P2> are <forward tag>.`,
    'UndertimeOvertimeException':
      `<P2> occurs if <P1> falls short of <mintime> <units> or lasts more than <maxtime> <units>.`,
    'Unidirectional_Relation': `<P1> relates to <P2>.', 'Invocation': '<P1> invokes <P2>.`,
    'Overtime_exception': `<P2> occurs if <P1> lasts more than <maxtime> <units>.`,
    'Bidirectional_Relation': `<P1> and <P2> are equivalent.`,
    'Generalization-Specialization': `<P2>is a <P1>.`,
    'Classification-Instantiation': `<P2> is an instance of <P1>.`,
    'Unidirectional_Relation_(tag)': `<P1> <tag> <P2>.`,
    'Bidirectional_Relation_(ftag,btag)': `<P1> <forward tag> <P2> and <P2> <backward tag> <P1>.`,
    'Exhibition-Characterization': `<P1> exhibits <P2>.`},
  'P1-P1 (same process)': {
    'Invocation': `<P1> invokes itself.`},
  'O-P': {
    'Condition_Agent': `<P> occurs if <O> exists, otherwise <P>  is skipped.`,
    'Consumption': `<P> consumes <O>.`,
    'Event_Consumption': `<O> initiates <P>, which consumes <O>.`,
    'Instrument': `<P> requires <O>.`,
    'Condition_Instrument': `<P> occurs if <O> exists, otherwise <P>  is skipped.`,
    'Event_Instrument': `<O> initiates <P>, which requires <O>.`,
    'Agent': `<O> handles <P>.`,
    'Event_Agent': `<O> initiates and handles<P>.`,
    'Condition_Consumption': `<P> occurs if <O> exists, in which case<P>  consumes <O>, otherwise <P>  is skipped.`,
    'Exhibition-Characterization': `<O> exhibits <P>.`,
  },
  'P-O': {
    'Exhibition-Characterization': `<P> exhibits <O>.`,
    'Result': `<P> yields <O>.`,
    'Effect': `<P> affects <O>.`,
    'Condition_Effect': `<P> occurs if <O> exists, in which case<P>  affects <O>, otherwise <P>  is skipped.`,
    'Event_Effect': `<O> initiates <P>, which affects <O>`
  },

  'Os-(P)-O (from object state to the same object)': {
    'Overtime_exception': `<O> triggers <P> when <O> is <s> more than <maxtime> <units>, in which case <P> changes <O>.`,
    'Condition_Input ': `<P> occurs if <O> is <s>, in which case <P> changes <O> from <s> , otherwise <P>  is skipped.`,
    'In/out_linkPair': `<P> changes <O> from <s>.`},
  'O1s-O2': {
    'Bidirectional_Relation_(tag)': `<s> <O1> and <O2> are <forward tag>.`,
    'Unidirectional_Relation': `<s> <O1> relates to <O2>.`,
    'Bidirectional_Relation': `<s> <O1> and <O2> are equivalent.`,
    'Unidirectional_Relation_(tag)': `<s> <O1> <tag> <O2>.`,
    'Bidirectional_Relation_(ftag,btag)': `<s> <O1>  <forward tag> <O2> and <O2> <backward tag> <s> <O1>.`,
    'Exhibition-Characterization': `<s> <O1> exhibits <O2>.`},
  'P-Os': {
    'Split_output': `<P> changes <O> to <s>.`,
    'Exhibition-Characterization': `<P> exhibits <s> <O>.`,
    'Result': `<P> yields <s> <O>.`},
  'O1s1-O2s2': {
    'Unidirectional_Relation': `<s1> <O1> relates to <s2> <O2>.`,
    'Bidirectional_Relation_(tag)': `<s1> <O1> and <s2> <O2> are <forward tag>.`,
    'Bidirectional_Relation_(ftag,btag)': `<s1> <O1> <forward tag> <s2><O2> and <s2><O2> <backward tag><s1> <O1>.`,
    'Bidirectional_Relation': `<s1> <O1> and <s2> <O2> are equivalent.`,
    'Unidirectional_Relation_(tag)': `<s1> <O1> <tag> <s2> <O2>.`},
  'O1-O2~n (n>=2 many destinations)': {
    'Aggregation-Participation': `<O1> consist of <O2.1>, <O2.2>, ... and <O2.n>.`,
    'Unidirectional_Relation': `<O1> relates to <O2.1>, <O2.2>, ... and <O2.n>.`,
    'Generalization-Specialization': `<O2.1>, <O2.2>, ... and <O2.n> are <O1>\'s\'.`,
    'Classification-Instantiation': `<O2.1>, <O2.2>, ... and <O2.n> are instances of <O1>.`,
    'Unidirectional_Relation_(tag)': `<O1> <tag> <O2.1>, <O2.2>, ... and <O2.n>.`,
    'Exhibition-Characterization': `<O1> exhibits<O2.1>, <O2.2>, ... and <O2.n>.`},
  'O1-O2s': {
    'Bidirectional_Relation_(tag)': `<O1> and <s> <O2> are <forward tag>.`,
    'Unidirectional_Relation': `<O1> relates to <s> <O2>.`,
    'Bidirectional_Relation': `<O1> and <s> <O2> are equivalent.`,
    'Unidirectional_Relation_(tag)': `<O1> <tag> <s> <O2>.`,
    'Bidirectional_Relation_(ftag,btag)': `<O1> <forward tag> <s><O2> and <s><O2> <backward tag> to  <O1>.`,
    'Exhibition-Characterization': `<O1> exhibits <s><O2>.`},
  'Os1-(P)-Os2 (same object)': {
    'Overtime_exception':
      `<O> triggers <P> when <O> is <s1> more than <maxtime> <units>, in which case <P> changes <o> to <s2>.`,
    'Condition_Input ': `<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P>  is skipped.`,
    'In/out_linkPair': `<P> changes <O> from <s1> to <s2>.`},
  'Os-P': {
    'Agent': `<s> <O> handles <P>.`,
    'Condition_Agent': `<P> occurs if <O> is <s>, otherwise <P> is skipped.`,
    'Event_Agent': `<s> <O> initiates and handles<P>.`,

    'Consumption': `<P> consumes <s> <O>.`,
    'Condition_Consumption': `<P> occurs if <O> is at state <s>, in which case <P> consumes <O>, otherwise <P> is skipped.`,
    'Event_Consumption': `<s> <O> initiates <P>, which consumes <O>.`,

    'Split_input': `<P> changes <O> from  <s>.`,

    'Instrument': `<P> requires <s> <O>.`,
    'Condition_Instrument': `<P> occurs if <O> is at state <s>, otherwise <P> is skipped.`,
    'Event_Instrument': `<s> <O> initiates <P>, which requires <s> <O>.`,

    'Overtime_exception': `<O> triggers <P> when <O> is <s> more than <maxtime> <units>.`,
    'Undertime_exception': `<O> triggers <P> when <O> is <s> less than <mintime> <units>.`,
    'UndertimeOvertimeException': `<O> triggers <P> when <O> is <s> more than <maxtime> <units> and less than <mintime> <units>.`,
    'Exhibition-Characterization': `<s> <O> exhibits <P>.`}
};

export const OplTables = {'en': defaultTable, 'fr': defaultTable_fr};
