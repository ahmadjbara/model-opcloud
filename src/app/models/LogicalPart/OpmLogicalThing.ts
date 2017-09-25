  import {OpmLogicalEntity} from './OpmLogicalEntity';
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';
  import * as ConfigurationOptions from '../ConfigurationOptions';
  import {Affiliation, Essence} from "../ConfigurationOptions";
  import {OpmVisualThing} from "../VisualPart/OpmVisualThing";

  export abstract class OpmLogicalThing<T extends OpmVisualThing> extends OpmLogicalEntity<T> {
    private _essence: Essence;
    private _affiliation: Affiliation;

    // constructor(essence: Essence, affiliation: Affiliation) {
    //   super();
    //   this._essence = essence;
    //   this._affiliation = affiliation;
    // }

// getters and setters
    get essence(): ConfigurationOptions.Essence {
      return this._essence;
    }
    set essence(essence: ConfigurationOptions.Essence) {
      this._essence = essence;
    }
    get affiliation(): ConfigurationOptions.Affiliation {
      return this._affiliation;
    }
    set affiliation(affiliation: ConfigurationOptions.Affiliation) {
      this._affiliation = affiliation;
    }
  }

