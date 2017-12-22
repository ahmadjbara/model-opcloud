  import {OpmLogicalThing} from './OpmLogicalThing';
  import {OpmVisualProcess} from '../VisualPart/OpmVisualProcess';
  import * as ConfigurationOptions from '../ConfigurationOptions';
  import {code} from '../ConfigurationOptions';

  export class OpmLogicalProcess extends OpmLogicalThing<OpmVisualProcess> {
    private _code: ConfigurationOptions.code;
    private _insertedFunction: string;
    constructor(params, model) {
      super(params, model);
      this.add(new OpmVisualProcess(params, this));
    }

    // getters and setters
    get code(): ConfigurationOptions.code {
      return this._code;
    }
    set code(code: ConfigurationOptions.code) {
      this._code = code;
    }
    get insertedFunction(): string {
      return this._insertedFunction;
    }
    set insertedFunction(insertedFunction: string) {
      this._insertedFunction = insertedFunction;
    }
    updateParams(params) {
      super.updateParams(params);
      this.code = this.getCodeType(params.function);
      // in case there is a user defined function, it will be stored in userDefinedFunction attribute.
      // in case there is a pre defined function, it will be stored in function attribute.
      // in case there is no function, function='None', userDefinedFunction undefined
      this.insertedFunction = (this.code === code.UserDefined) ? params.userDefinedFunction : params.function;
    }
    getCodeType(functionType) {
      switch (functionType) {
        case 'None':
          return code.Unspecified;
        case 'userDefined':
          return code.UserDefined;
        default:
          return code.PreDefined;
      }
    }
    getParams() {
      const visualElementsParams = new Array();
      for (let i = 0; i < this.visualElements.length; i++) {
        visualElementsParams.push(this.visualElements[i].getParams());
      }
      const params = {
        code: this.code,
        insertedFunction: this.insertedFunction,
        visualElementsParams: visualElementsParams
      };
      return {...super.getThingParams(), ...params};
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        code: jsonElement.code,
        userDefinedFunction: jsonElement.insertedFunction
      };
      return {...super.getThingParamsFromJsonElement(jsonElement), ...params};
    }
  }

