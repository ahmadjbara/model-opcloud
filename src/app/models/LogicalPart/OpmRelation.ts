  import {OpmLogicalElement} from './OpmLogicalElement';
  import {OpmLink} from '../VisualPart/OpmLink';
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';
  import {linkConnectionType} from '../ConfigurationOptions';
  import {linkType} from '../ConfigurationOptions';

  export class OpmRelation extends OpmLogicalElement<OpmLink> {
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
  }

