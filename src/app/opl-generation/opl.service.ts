import { Injectable } from '@angular/core';
import { OplTables, language} from './opl-database';
import { OplElementComponent} from './opl-element/opl-element.component';
import { GraphService} from "../rappid-components/services/graph.service";

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
    this.currentLanguage = language.current;
    this.OplTables = OplTables;
    this.availableLanguage = language.available;
    this.defaultEssence = 'Informatical';
    this.defaultAffiliation = 'Systemic';
  }
  getCurrentLanguage() {
    return this.currentLanguage;
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
    this.currentLanguage = lan;
    language.current = lan;

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


}


