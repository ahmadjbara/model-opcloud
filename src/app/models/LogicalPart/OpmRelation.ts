  import {OpmLogicalElement} from './OpmLogicalElement';
  import {OpmLink} from '../VisualPart/OpmLink';
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';
  import {linkConnectionType} from '../ConfigurationOptions';
  import {linkType} from '../ConfigurationOptions';
  import {OpmLogicalObject} from "./OpmLogicalObject";

  export class OpmRelation<T extends OpmLink> extends OpmLogicalElement<T> {
    private _sourceLogicalElement: OpmLogicalElement<OpmVisualElement>;
    private _targetLogicalElements: Array<OpmLogicalElement<OpmVisualElement>>;
    private _linkConnectionType: linkConnectionType;
    private _sourceCardinality: string;
    private _targetCardinality: string;
    private _linkType: linkType;
    get sourceLogicalElement(): OpmLogicalElement<OpmVisualElement> {return this._sourceLogicalElement; }
    set sourceLogicalElement(value: OpmLogicalElement<OpmVisualElement>) {this._sourceLogicalElement = value; }
    get targetLogicalElements(): Array<OpmLogicalElement<OpmVisualElement>> {return this._targetLogicalElements; }
    set targetLogicalElements(value: Array<OpmLogicalElement<OpmVisualElement>>) {this._targetLogicalElements = value; }
    get linkConnectionType(): linkConnectionType {return this._linkConnectionType; }
    set linkConnectionType(value: linkConnectionType) {this._linkConnectionType = value; }
    get sourceCardinality(): string {return this._sourceCardinality; }
    set sourceCardinality(value: string) {this._sourceCardinality = value; }
    get targetCardinality(): string {return this._targetCardinality; }
    set targetCardinality(value: string) {this._targetCardinality = value; }
    get linkType(): linkType {return this._linkType; }
    set linkType(value: linkType) {this._linkType = value; }
    constructor(params, model) {
      super(params, model);
    }
    updateParams(params) {
      super.updateParams(params);
      this.targetLogicalElements = new Array<OpmLogicalElement<OpmVisualElement>>();
      const sourceLogicalElement = this.opmModel.getLogicalElementByVisualId(params.sourceElementId);
      this.sourceLogicalElement = sourceLogicalElement ? sourceLogicalElement : params.sourceElementId;
      let targetLogicalElement = this.opmModel.getLogicalElementByVisualId(params.targetElementId);
      targetLogicalElement = targetLogicalElement ? targetLogicalElement : params.targetElementId;
        this.targetLogicalElements.push(this.opmModel.getLogicalElementByVisualId(params.targetElementId));
      this.linkConnectionType = params.linkConnectionType;
      this.linkType = params.linkType;
    }
    getRelationParams() {
      const params = {
        linkConnectionType: this.linkConnectionType,
        linkType: this.linkType
      };
      return {...super.getElementParams(), ...params};
    }
    getRelationParamsFromJsonElement(jsonElement) {
      return {
        linkConnectionType: jsonElement.linkConnectionType,
        linkType: jsonElement.linkType
      };
    }
    updateSourceAndTargetFromJson() {
      if (typeof this.sourceLogicalElement === 'string') {
        this.sourceLogicalElement = this.opmModel.getLogicalElementByVisualId(this.sourceLogicalElement);
      }
      for (let i = 0; i < this.targetLogicalElements.length; i++) {
        if (typeof this.targetLogicalElements[i] === 'string') {
          this.targetLogicalElements[i] = this.opmModel.getLogicalElementByVisualId(this.targetLogicalElements[i]);
        }
      }
      for (let i = 0; i < this.visualElements.length; i++) {
        this.visualElements[i].updateSourceAndTargetFromJson();
      }
    }
  }

