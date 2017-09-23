  import {OpmLogicalElement} from './OpmLogicalElement';
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';

  export class OpmLogicalEntity<T extends OpmVisualElement> extends OpmLogicalElement<T> {
    private _shape: string;
    // getters and setters
    get shape(): string {
      return this._shape;
    }
    set shape(newShape: string) {
      this._shape = newShape;
    }
  }

