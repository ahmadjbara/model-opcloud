  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmLink extends OpmVisualElement {
    sourceVisualElement: OpmVisualElement;
    targetVisualElement: Array<OpmVisualElement>;
    private vertices: Array<[number, number]>;
    private symbolPos: [number, number];
  }
