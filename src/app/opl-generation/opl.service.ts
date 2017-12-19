import { Injectable } from '@angular/core';
import { defaultTable} from './opl-database';
import { OplElementComponent} from './opl-element/opl-element.component';

//set GCLOUD_PROJECT=opcloud-sandbox

//set GOOGLE_APPLICATION_CREDENTIALS=src/environments/OPCloud-SandBox-69edb5f6ff00.json
/*const Translate = require('@google-cloud/translate')({
  projectId: 'opcloud-sandbox',
  keyFilename: 'src/app/opl-generation/OPCloud-SandBox-69edb5f6ff00.json'
});*/

@Injectable()
export class OplService {
  private currentLanguage: string;
  private OplTables;
  private availableLanguage;
  private defaultEssence;
  private defaultAffiliation;


  constructor() {
    this.currentLanguage = 'en';
    this.OplTables = {'en': defaultTable};
    this.availableLanguage = ['en', 'cn', 'swe', 'fr'];
    this.defaultEssence = 'Informatical';
    this.defaultAffiliation = 'Systemic';
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
  getDefaultAffliation() {
    return this.defaultAffiliation;
  }
  getDefaultEssence() {
    return this.defaultEssence;
  }
  changeOplTable(lan: string, updatedTable) {
    this.OplTables[lan] = updatedTable;
  }
  replaceElement(template: string , from: string , to: string) {
    return template.replace(from, to);
  }
  setDefaultEssence(essence: string) {
    this.defaultEssence = essence;
  }
  setDefaultAffilication(affiliation: string) {
    this.defaultAffiliation = affiliation;
  }
  getRelationsList() {
    const Relations = {};
    const relations = Object.keys(this.getOplTable(this.currentLanguage));
    for (let relation of relations) {
      const leftP = relation.indexOf('(');
      if (leftP) {
        const cut = relation.slice(leftP, );
        relation = relation.replace(cut, '');
      }
      const srctrg = relation.split('-');
      Relations[relation] = {};
      Relations[relation]['source'] = srctrg.shift();
      Relations[relation]['target'] = srctrg;
    }
    return Relations;
  }
  breakOs(Os: string) {
    const cutPoint = Os.indexOf('s');
    const s = Os.slice(cutPoint);
    const O = Os.replace(s, '');
    return [O, s];
  }
  sourceTargetRelation(source, target) {
    const relations = this.getRelationsList();
    const sourceID = source.attributes._id;
    const targetID = target.attributes._id;
    const sourceType = source.attributes.type.slice(4, 5);
    const targetType = target.attributes.type.slice(4, 5);
    if (target.length === 1) {
      for (const relation of Object.keys(relations)){
        if (sourceType in relations[relation].source && targetType in relations[relation].target) {
          return relation;
        }
      }
    }
  }

  replaceInTemplate(source, target, template){
    let opl = template;



  }
  stringify(cell) {
    if (cell.isPrototypeOf(Array)) {
      if (cell.length === 1 ) {
        return `<opl-element [cell]="${cell}"></opl-element>`;
      } else {
        const len = cell.length;
        let group = ``;
        for (let i = 0; i < (len - 1); i++) {
          group = group + `<opl-element [cell]="${cell[i]}"></opl-element> `;
        }
        group = group + `and <opl-element [cell]="${cell[len - 1]}"></opl-element>`;
        return group;
      }
    }else {
      return `<opl-element [cell]="${cell}"></opl-element>`;
    }
  }

  generateOPL(source, target, template) {
    const relation = this.sourceTargetRelation(source, target);
    const sourceString = this.stringify(source);
    const targetString = this.stringify(target);

    return
  }


}


