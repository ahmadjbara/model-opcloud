  import {OpmLogicalEntity} from './OpmLogicalEntity';
  import {Affiliation, Essence} from '../ConfigurationOptions';
  import {OpmVisualThing} from '../VisualPart/OpmVisualThing';

  export abstract class OpmLogicalThing<T extends OpmVisualThing> extends OpmLogicalEntity<T> {
    private _essence: Essence;
    private _affiliation: Affiliation;

   constructor(params, model) {
     super(params, model);
   }

    get essence(): Essence {
      return this._essence;
    }
    set essence(essence: Essence) {
      this._essence = essence;
    }
    get affiliation(): Affiliation {
      return this._affiliation;
    }
    set affiliation(affiliation: Affiliation) {
      this._affiliation = affiliation;
    }
    updateParams(params) {
      super.updateParams(params);
      this.essence = params.essence;
      this.affiliation = params.affiliation;
    }
    getThingParams() {
     const params = {
       essence: this.essence,
       affiliation: this.affiliation
     };
     return {...super.getEntityParams(), ...params};
    }
    getThingParamsFromJsonElement(jsonElement) {
      const params = {
        essence: (jsonElement.essence === 0) ? Essence.Informatical : Essence.Physical,
        affiliation: (jsonElement.affiliation === 0) ? Affiliation.Systemic : Affiliation.Environmental,
      };
      return {...super.getEntityParamsFromJsonElement(jsonElement), ...params};
    }
  }

