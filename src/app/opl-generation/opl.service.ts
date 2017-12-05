import { Injectable } from '@angular/core';

@Injectable()
export class OplService {
  private currentLanguage: string;
  private OplTables;
  private availableLanguage;
//  private translate = require('@google-cloud/translate');

  constructor() {
    this.currentLanguage = 'en';
    this.OplTables = {'en': defaultTable};
    this.availableLanguage = ['en', 'cn', 'swe', 'fr'];
  }

  getOplTable(selectedLanguage: string) {
    if (Object.keys(this.OplTables).includes(selectedLanguage)) {
      return this.OplTables[selectedLanguage];
    } /*else {
      const table = defaultTable;
      for (const relation of Object.keys(table)){
        for (const link of Object.keys(relation)){
          this.translate( table[relation][link], {from: 'en', to: selectedLanguage}).then(res => {
            table[relation][link] = res.text;
          }).catch(err => {
            console.error(err);
          });
        }
      }
      this.OplTables[selectedLanguage] = table;*/
   // }
  }

  getAvailableLanguage() {
    return this.availableLanguage;
  }
  changeOplTable(lan: string, updatedTable) {
    this.OplTables[lan] = updatedTable;
  }
  replaceElement(template: string , from: string , to: string) {
    return template.replace(from, to);
  }




}

export const defaultTable =  {
  'Os-(P)-O (from object state to the same object)': {
    'Overtime exception <maxtime, unit>': '<O> triggers <P> when <O> is <s> more than <maxtime> <units>, in which case <P> changes <O>.',
    'Condition Input ': '<P> occurs if <O> is <s>, in which case <P> changes <O> from <s> , otherwise <P>  is skipped.',
    'In-out link pair': '<P> changes <O> from <s>.'},
  'O1s-O2': {
    'Bi-direct (tag)': '<S> <O1> and <O2> are <forward tag>.',
    'Uni-direct (null tag)': '<S> <O1> relates to <O2>.',
    'Bi-direct (null tags)': '<S> <O1> and <O2> are equivalent.',
    'Uni-direct (tag)': '<S> <O1> <tag> <O2>.',
    'Bi-direct (ftag, btag)': '<S> <O1>  <forward tag> <O2> and <O2> <backward tag> <S> <O1>.',
    'Exhibition-Characterization': '<S> <O1> exhibits <O2>.'},
  'P1-O2s': {
    'split output': '<P2> changes <O1> to <s2>.',
    'Exhibition-Characterization': '<P1> exhibits <s> <O2>.',
    'Result': '<P1> yields <s> <O2>.'},
  'P1-P1 (same process)': {
    'Invocation': '<P1> invokes itself.'},
  'O1-P2': {
    'Condition Agent': '<P2> occurs if <O1> exists, otherwise <P2>  is skipped.',
    'Consumption': '<P2> consumes <O1>.',
    'Event  Consumption': '<O1> initiates <P2>, which consumes <O1>.',
    'Condition Effect': '<P1> occurs if <O1> exists, in which case<P1>  affects <O1>, otherwise <P2>  is skipped.',
    'Instrument': '<P2> requires <O1>.',
    'Condition Instrument': '<P2> occurs if <O1> exists, otherwise <P2>  is skipped.',
    'Event Instrument': '<O1> initiates <P2>, which requires <O1>.',
    'Agent': '<O1> handels <P2>.',
    'Event Agent': '<O1> initiates and handles<P2>.',
    'Condition Consumption': '<P1> occurs if <O1> exists, in which case<P1>  consumes <O1>, otherwise <P2>  is skipped.',
    'Exhibition-Characterization': '<O1> exhibits <P2>.',
    'Event Effect': '<O1> initiates <P2>, which affects <O1>'},
  'O1s1-O2s2': {
    'Uni-direct (null tag)': ' <S1> <O1> relates to <s2> <O2>.',
    'Bi-direct (tag)': ' <S1> <O1> and <s2> <O2> are <forward tag>.',
    'Bi-direct (ftag, btag)': ' <s1> <O1> <forward tag> <s><O2> and <s><O2> <backward tag><s1> <O1>. ',
    'Bi-direct (null tags)': ' <S1> <O1> and <s2> <O2> are equivalent.',
    'Uni-direct (tag)': ' <S1> <O1> <tag> <s2> <O2>.'},
  'O1-O2.1...O2.n (n>2 many destinations)': {
    'Aggregation-Participation': '<O1> consist of <O2.1>, <O2.2>, ... and <O2.n>.',
    'Uni-direct (null tag)': '<O1> relates to <O2.1>, <O2.2>, ... and <O2.n>.',
    'Generalization-Specialization': '<O2.1>, <O2.2>, ... and <O2.n> are <O1>\'s\'.',
    'Classification-Instantiation': '<O2.1>, <O2.2>, ... and <O2.n> are instances of <O1>.',
    'Uni-direct (tag)': '<O1> <tag> <O2.1>, <O2.2>, ... and <O2.n>.',
    'Exhibition-Characterization': '<O1> exhibits<O2.1>, <O2.2>, ... and <O2.n>.'},
  'O1-O2s': {
    'Bi-direct (tag)': ' <O1> and <s> <O2> are <forward tag>.',
    'Uni-direct (null tag)': ' <O1> relates to <s> <O2>.',
    'Bi-direct (null tags)': ' <O1> and <s> <O2> are equivalent.',
    'Uni-direct (tag)': ' <O1> <tag> <s> <O2>.',
    'Bi-direct (ftag, btag)': ' <O1> <forward tag> <s><O2> and <s><O2> <backward tag> to  <O1>.',
    'Exhibition-Characterization': '<O1> exhibits <s><O2>.'},
  'Os1-(P)-Os2 (same object)': {
    'Overtime exception <maxtime, unit>':
      '<O> triggers <P> when <O> is <s1> more than <maxtime> <units>, in which case <P> changes <o> to <s2>.',
    'Condition Input ': '<P> occurs if <O> is <s1>, in which case <P> changes <O> from <s1> to <s2>, otherwise <P>  is skipped.',
    'In-out link pair': '<P> changes <O> from <s1> to <s2>.'},
  'P1-O2': {
    'Exhibition-Characterization': '<P1> exhibits <O2>.',
    'Result': '<P1> yields <O2>.',
    'Effect': '<P1> affects <O2>.'},
  'P1-P2': {
    'Undertime exception<mintime,unit>': '<P2> occurs if <P1> falls short of <mintime> <units>.',
    'Aggregation-Participation': '<P1> consist of <P2>.', 'Bi-direct (tag)': '<P1> and <P2> are <forward tag>.',
    'Undertime and overtime exception <mintime..maxtime, unit>':
      '<P2> occurs if <P1> falls short of <mintime> <units> or lasts more than <maxtime> <units>.',
    'Uni-direct (null tag)': '<P1> relates to <P2>.', 'Invocation': '<P1> invokes <P2>.',
    'Overtime exception <maxtime, unit>': '<P2> occurs if <P1> lasts more than <maxtime> <units>.',
    'Bi-direct (null tags)': '<P1> and <P2> are equivalent.',
    'Generalization-Specialization': '<P2>is a <P1>.',
    'Classification-Instantiation': '<P2> is an instance of <P1>.',
    'Uni-direct (tag)': '<P1> <tag> <P2>.',
    'Bi-direct (ftag, btag)': '<P1> <forward tag> <P2> and <P2> <backward tag> <P1>.',
    'Exhibition-Characterization': '<P1> exhibits <P2>.'},
  'O1-O2': {
    'Aggregation-Participation': '<O1> consist of <O2>.',
    'Bi-direct (tag)': '<O1> and <O2> are <tag>.',
    'Uni-direct (null tag)': '<O1> relates to <O2>.',
    'Bi-direct (null tags)': '<O1> and <O2> are equivalent.',
    'Generalization-Specialization': '<O2>is a <O1>.',
    'Classification-Instantiation': '<O2> is an instance of <O1>.',
    'Bi-direct (ftag, btag)': '<O1> <forward tag> <O2> and <O2> <backward tag> <O1>.\r',
    'Exhibition-Characterization': '<O1> exhibits <O2>.'},
  'O1s-P2': {
    'Condition Agent': '<P2> occurs if <O1> is  <s>, otherwise <P2>  is skipped.',
    'Consumption': '<P2> consumes <s>  <O1>.',
    'split input': '<P2> changes <O1> from  <s1>.',
    'Event  Consumption': '<S> <O1> initiates <P2>, which consumes <O1>.',
    'Agent': '<S> <O1> handels <P2>.',
    'Instrument': '<P2> requires <s> <O1>.',
    'Condition Instrument': '<P2> occurs if <O1> is at state <s>, otherwise <P2>  is skipped.',
    'Overtime exception <maxtime, unit>': '<O1> triggers <P2> when <O1> is <s> more than <maxtime> <units>.',
    'Condition Consumption': '<P1> occurs if  <O1> is at state <s>, in which case<P1>  consumes\r<O1>, otherwise <P2>  is skipped.',
    'Exhibition-Characterization': '<S> <O1> exhibits <P2>.'},
  'O1-O2.1,O2.2 (two destinations)': {
    'Aggregation-Participation': '<O1> consist of <O2.1> and <O2.2>.',
    'Uni-direct (null tag)': '<O1> relates to <O2.1> and <O2.2>.',
    'Generalization-Specialization': '<O2.1> and <O2.2> are <O1>\'s\'.',
    'Classification-Instantiation': '<O2.1> and <O2.2> are instances of <O1>.',
    'Uni-direct (tag)': '<O1> <tag> <O2.1> and <O2.2>.',
    'Exhibition-Characterization': '<O1> exhibits <O2.1> and <O2.2>.'}};

