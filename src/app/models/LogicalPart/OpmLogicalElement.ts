
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';

  export abstract class OpmLogicalElement<T extends OpmVisualElement> {
    static objectText="Object";
    static processText="Process";
    static stateText="State";
    visualElements: Array<T>;
    private _text: string;

    // getters and setters
    get text(): string {
      return this._text;
    }
    set text(newText: string) {
      this._text = newText;
    }
  }

