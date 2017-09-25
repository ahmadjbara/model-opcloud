  import {OpmLogicalElement} from './OpmLogicalElement';
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';
  import {OpmVisualEntity} from "../VisualPart/OpmVisualEntity";

  export abstract class OpmLogicalEntity<T extends OpmVisualEntity> extends OpmLogicalElement<T> {
    private _shape: string;
    // getters and setters
    get shape(): string {
      return this._shape;
    }
    set shape(newShape: string) {
      this._shape = newShape;
    }
  }

