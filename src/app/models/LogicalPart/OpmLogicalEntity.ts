  import {OpmLogicalElement} from './OpmLogicalElement';
  import {OpmVisualEntity} from '../VisualPart/OpmVisualEntity';

  export abstract class OpmLogicalEntity<T extends OpmVisualEntity> extends OpmLogicalElement<T> {
    private _text: string;
    constructor(params, model) {
      super(params, model);
    }
    get text(): string { return this._text; }
    set text(text: string) { this._text = text; }
    updateParams(params) {
      super.updateParams(params);
      this.text = params.text;
    }
    getEntityParams() {
      const params = {
        text: this.text
      };
      return {...super.getElementParams(), ...params};
    }
    getEntityParamsFromJsonElement(jsonElement) {
      const params = {
        text: jsonElement.text,
      };
      return params;
    }
  }

