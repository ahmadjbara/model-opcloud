  import {OpmLogicalElement} from './OpmLogicalElement';
  import {OpmVisualEntity} from '../VisualPart/OpmVisualEntity';

  export abstract class OpmLogicalEntity<T extends OpmVisualEntity> extends OpmLogicalElement<T> {
    private _text: string;
    constructor(model) {
      super(model);
    }
    get text(): string { return this._text; }
    set text(text: string) { this._text = text; }
  }

