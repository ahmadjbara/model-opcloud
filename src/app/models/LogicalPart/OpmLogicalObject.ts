  import {OpmLogicalThing} from './OpmLogicalThing';
  import {OpmVisualObject} from '../VisualPart/OpmVisualObject';
  import {valueType} from '../ConfigurationOptions';

  export class OpmLogicalObject extends OpmLogicalThing<OpmVisualObject> {
    private _valueType: valueType;
    private _value: any;
    private _units: string;

    constructor(params) {
      super(params);
      this.visualElements = new Array<OpmVisualObject>();
      this.add(params);
      this.text = OpmLogicalObject.objectText;
      // Different types - will be changed.
      // this.valueType = params.valueType;
      this.value = params.value;
      this.units = params.units;
    }
    add(params) {
      this.visualElements.push(new OpmVisualObject(params));
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
  }

