  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmLink extends OpmVisualElement {
    sourceVisualElement: OpmVisualElement;
    targetVisualElements: Array<TargetElementData>;
    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    updateParams(params) {
      super.updateParams(params);
      this.targetVisualElements = new Array<TargetElementData>();
      const sourceVisualElement = this.logicalElement.opmModel.getVisualElementById(params.sourceElementId);
      this.sourceVisualElement = sourceVisualElement ? sourceVisualElement : params.sourceElementId;
      let targetVisualElement = this.logicalElement.opmModel.getVisualElementById(params.targetElementId);
      targetVisualElement = targetVisualElement ? targetVisualElement : params.targetElementId;
      this.targetVisualElements.push(new TargetElementData(targetVisualElement, params.vertices));
    }
    getLinkParams() {
      const targetVisualElements = new Array<TargetElementData>();
      for (let i = 0; i < this.targetVisualElements.length; i++) {
        if (this.targetVisualElements[i].targetVisualElement) {
          const targetElementData = new TargetElementData(this.targetVisualElements[i].targetVisualElement.id, this.targetVisualElements[i].vertices);
          targetVisualElements.push(targetElementData);
        }
      }
      const params = {
        targetVisualElements: targetVisualElements,
        sourceVisualElement: this.sourceVisualElement ? this.sourceVisualElement.id : null,
      };
      return {...super.getElementParams(), ...params};
    }
    getLinkParamsFromJsonElement(jsonElement) {
      const params = {
        sourceElementId: jsonElement.sourceVisualElement,
        targetElementId: jsonElement.targetVisualElements[0] ? jsonElement.targetVisualElements[0].targetVisualElement : null,
        vertices: jsonElement.targetVisualElements[0] ? jsonElement.targetVisualElements[0].vertices : null
      };
      return {...super.getElementParamsFromJsonElement(jsonElement), ...params};
    }
    // in case instead of a reference to an object there is a string (representing object's id),
    // replace the id with the reference to object
    updateSourceAndTargetFromJson() {
      if (typeof this.sourceVisualElement === 'string') {
        this.sourceVisualElement = this.logicalElement.opmModel.getVisualElementById(this.sourceVisualElement);
      }
      for (let i = 0; i < this.targetVisualElements.length; i++) {
        if (typeof this.targetVisualElements[i].targetVisualElement === 'string') {
          this.targetVisualElements[i].targetVisualElement = this.logicalElement.opmModel.getVisualElementById(this.targetVisualElements[i].targetVisualElement);
        }
      }
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
