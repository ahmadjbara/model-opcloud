import {OplTables, language} from "./opl-database";
import {OpmDefaultLink} from "../models/DrawnPart/Links/OpmDefaultLink";
import {OpmFundamentalLink} from "../models/DrawnPart/Links/OpmFundamentalLink";


export const oplFunctions = {
  getStatefulObject(state) {
    return state.getParent();
  },

  sourceTargetRelation(source, target) {
    if (!target.isPrototypeOf(Array)) {
      const sourceID = source.attributes.id;
      const targetID = target.attributes.id;
      const sourceType = source.attributes.type;
      const targetType = target.attributes.type;
      const relation = {relation: '', pairs: {}};

      switch (sourceType) {
        case 'opm.Object':
          if (targetType === 'opm.Object') {
            relation['relation'] = 'O1-O2';
            relation['pairs'] = {O1: source, O2: target};
          } else if (targetType === 'opm.Process') {
            relation['relation'] = 'O-P';
            relation['pairs'] = {O: source, P: target};
          } else if (targetType === 'opm.State') {
            const Object2 = this.getStatefulObject(target);
            relation['pairs'] = {O1: source, s: target, O2: Object2};
            relation['relation'] = 'O1-O2s';
          }
          break;
        case 'opm.Process':
          if (targetType === 'opm.Object') {
            relation['pairs'] = {P: source, O: target};
            relation['relation'] = 'P-O';
          } else if (targetType === 'opm.Process') {
            if (targetID !== sourceID) {
              relation['pairs'] = {P1: source, P2: target};
              relation['relation'] = 'P1-P2';
            } else {
              relation['pairs'] = {P1: source};
              relation['relation'] = 'P1-P1 (same process)';
            }
          } else if (targetType === 'opm.State') {
            const Object = this.getStatefulObject(target);
            relation['pairs'] = {P: source, s: target, O: Object};
            relation['relation'] = 'P-Os';
          }
          break;
        case 'opm.State':
          if (targetType === 'opm.Object') {
            const Object1 = this.getStatefulObject(source);
            relation['pairs'] = {s: source, O2: target, O1: Object1};
            relation['relation'] = 'O1s-O2';
          } else if (targetType === 'opm.Process') {
            const Object = this.getStatefulObject(source);
            relation['pairs'] = {s: source, P: target, O: Object};
            relation['relation'] = 'Os-P';
//TODO:In/out link pair identification
          } else if (targetType === 'opm.State') {
            const Object1 = this.getStatefulObject(source);
            const Object2 = this.getStatefulObject(target);
            relation['pairs'] = {s1: source, s2: target, O1: Object1, O2: Object2};
            relation['relation'] = 'O1s1-O2s2';
          }
          break;
      }
      return relation;
    }else {
      const sourceType = source.attributes.type;
      const relation = {relation: '', pairs: {}};
      if (sourceType === 'opm.Object') {
        relation['pairs'] = {O1: source, O2n: target};
        relation['relation'] = 'O1-O2..n (n>=2 many destinations)';
      }
     return relation;
    }
  },
  replaceInTemplate(code, cell, template) {
    let opl = template;
    code = `<${code}>`;
    while (opl.indexOf(code) > -1) {
      //opl = opl.replace(code, `<opcloud-opl-element [cell]="${cell}"></opcloud-opl-element>`);
      opl = opl.replace(code, `<b class="${cell.attributes.type.slice(4, ).toLowerCase() }">${cell.attributes.attrs.text.text}</b>`);
    }

    return opl;
  },

  /*stringify(cell) {
    if (cell.isPrototypeOf(Array)) {
      if (cell.length === 1 ) {
        return `<opcloud-opl-elementopl-element [cell]="${cell}"></opcloud-opl-elementopl-element>`;
      } else {
        const len = cell.length;
        let group = ``;
        for (let i = 0; i < (len - 1); i++) {
          group = group + `<opcloud-opl-elementopl-element [cell]="${cell[i]}"></opcloud-opl-elementopl-element> `;
        }
        group = group + `and <opcloud-opl-elementopl-element [cell]="${cell[len - 1]}"></opcloud-opl-elementopl-element>`;
        return group;
      }
    }else {
      return `<opcloud-opl-elementopl-element [cell]="${cell}"></opcloud-opl-elementopl-element>`;
    }
  }*/

  generateRelationOPL(pairs, template) {
    let opl = template;
    for (const code of Object.keys(pairs)){
      opl = this.replaceInTemplate(code, pairs[code], opl);
    }
    opl = opl.replace(`.`, `<b>.</b>`);

    return opl;
  },

  generateLinksWithOpl(link) {
    const source = link.getSourceElement();
    const target = link.getTargetElement();
    const stRelation = this.sourceTargetRelation(source, target);
    const relation = stRelation['relation'];
    const pairs = stRelation['pairs'];
    const list = OplTables[language.current][relation];
    const result = [];
    for (const linkType of Object.keys(list)){
      const OPL = this.generateRelationOPL(pairs, list[linkType]) ;
      result.push({name: linkType, opl: OPL});
    }
    return result;
  },

  generateLinkOpl(link, linkType) {
    if (linkType === 'defaultLink') {
      return null;
    }
    let source = link.getSourceElement();
    const target = link.getTargetElement();
    if ([ 'Aggregation-Participation', 'Generalization-Specialization', 'Classification-Instantiation',
      'Exhibition-Characterization'].indexOf(linkType) > -1) {
      source = link.getSource();
    }
    const stRelation = this.sourceTargetRelation(source, target);
    const relation = stRelation['relation'];
    const pairs = stRelation['pairs'];
    const list = OplTables[language.current][relation];
    const OPL = this.generateRelationOPL(pairs, list[linkType]);

    return OPL;
  },



};

