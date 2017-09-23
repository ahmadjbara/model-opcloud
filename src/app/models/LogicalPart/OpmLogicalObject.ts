  import {OpmLogicalThing} from './OpmLogicalThing';
  import {OpmVisualObject} from '../VisualPart/OpmVisualObject';
  import * as ConfigurationOptions from '../ConfigurationOptions';

  export class OpmLogicalObject extends OpmLogicalThing<OpmVisualObject> {
    private _valueType: ConfigurationOptions.valueType;
    private _value: any;
    private _units: string;
    // getters and setters
    get valueType(): ConfigurationOptions.valueType {
      return this._valueType;
    }
    set valueType(valueType: ConfigurationOptions.valueType) {
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

