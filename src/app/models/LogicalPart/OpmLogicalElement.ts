
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';

  export class OpmLogicalElement<T extends OpmVisualElement> {
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

