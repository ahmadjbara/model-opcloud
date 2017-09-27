  import {OpmLogicalEntity} from './OpmLogicalEntity';
  import {Affiliation, Essence} from '../ConfigurationOptions';
  import {OpmVisualThing} from '../VisualPart/OpmVisualThing';

  export abstract class OpmLogicalThing<T extends OpmVisualThing> extends OpmLogicalEntity<T> {
    private _essence: Essence;
    private _affiliation: Affiliation;

     constructor(params) {
       super();
       this.essence = params.essence;
       this.affiliation = params.affiliation;
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
  }

