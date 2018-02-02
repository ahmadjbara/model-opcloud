  import {OpmLogicalThing} from './OpmLogicalThing';
  import {OpmVisualObject} from '../VisualPart/OpmVisualObject';
  import {valueType} from '../ConfigurationOptions';

  export class OpmLogicalObject extends OpmLogicalThing<OpmVisualObject> {
    private _valueType: valueType;
    private _value: any;
    private _units: string;

    constructor(params, model) {
      super(params, model);
      this.add(new OpmVisualObject(params, this));
    }
    // getters and setters
    get valueType(): valueType {
      return this._valueType;
    }
    set valueType(valueType: valueType) {
      this._valueType = valueType;
    }
    get value(): any {
      return this._value;
    }
    set value(value: any) {
      this._value = value;
    }
    get units(): string {
      return this._units;
    }
    set units(units: string) {
      this._units = units;
    }
    updateParams(params) {
      super.updateParams(params);
      this.valueType = params.valueType;
      this.value = params.value;
      this.units = params.units;
    }
    getParams() {
      const visualElementsParams = new Array();
      for (let i = 0; i < this.visualElements.length; i++) {
        visualElementsParams.push(this.visualElements[i].getParams());
      }
      const params = {
        valueType: this.valueType,
        value: this.value,
        units: this.units,
        visualElementsParams: visualElementsParams
      };
      return {...super.getThingParams(), ...params};
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        valueType: jsonElement.valueType,
        value: jsonElement.value,
        units: jsonElement.units,
      };
      return {...super.getThingParamsFromJsonElement(jsonElement), ...params};
    }
  }

