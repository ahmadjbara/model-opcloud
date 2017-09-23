  import {OpmLogicalThing} from './OpmLogicalThing';
  import {OpmVisualProcess} from '../VisualPart/OpmVisualProcess';
  import * as ConfigurationOptions from '../ConfigurationOptions';

  export class OpmLogicalProcess extends OpmLogicalThing<OpmVisualProcess> {
    private _code: ConfigurationOptions.code;
    private _functionType: ConfigurationOptions.functionType;
    private _insertedFunction: string;
    // getters and setters
    get code(): ConfigurationOptions.code {
      return this._code;
    }
    set code(code: ConfigurationOptions.code) {
      this._code = code;
    }
    get functionType(): ConfigurationOptions.functionType {
      return this._functionType;
    }
    set functionType(functionType: ConfigurationOptions.functionType) {
      this._functionType = functionType;
    }
    get insertedFunction(): string {
      return this._insertedFunction;
    }
    set insertedFunction(insertedFunction: string) {
      this._insertedFunction = insertedFunction;
    }
  }

