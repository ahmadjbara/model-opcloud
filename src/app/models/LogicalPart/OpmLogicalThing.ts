  import {OpmLogicalEntity} from './OpmLogicalEntity';
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';
  import * as ConfigurationOptions from '../ConfigurationOptions';

  export class OpmLogicalThing<T extends OpmVisualElement> extends OpmLogicalEntity<T> {
    private _essence: ConfigurationOptions.Essence;
    private _affiliation: ConfigurationOptions.Affiliation;

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

