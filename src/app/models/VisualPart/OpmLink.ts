  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmLink extends OpmVisualElement {
    sourceVisualElement: OpmVisualElement;
    targetVisualElements: Array<TargetElementData>;
  }
  /*
   TargetElementData contains the target element and an array of vertices on the connection
   that gets to it. In case of fundamental link it will be all the vertices from the
   triangle to the target, in any other case it will be the vertices from the source to the
   target.
   */
  class TargetElementData {
    targetVisualElement: OpmVisualElement;
    vertices: Array<[number, number]>;
  }
