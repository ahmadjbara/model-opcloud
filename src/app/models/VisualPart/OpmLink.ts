  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmLink extends OpmVisualElement {
    sourceVisualElement: OpmVisualElement;
    targetVisualElements: Array<TargetElementData>;
    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.targetVisualElements = new Array<TargetElementData>();
      this.sourceVisualElement = this.logicalElement.opmModel.getVisualElementById(params.sourceElementId);
      const targetVisualElement = this.logicalElement.opmModel.getVisualElementById(params.targetElementId);
      this.targetVisualElements.push(new TargetElementData(targetVisualElement, params.vertices));
    }
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
    constructor(targetVisualElement, vertices) {
      this.targetVisualElement = targetVisualElement;
      this.vertices = vertices;
    }
  }
