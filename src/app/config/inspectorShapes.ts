import { selectOptions } from './selectOptions';
import {createGroup} from './inspector.config';
import {createColorsObject, createRangeObject, createSelection, createTextContentObject}
        from '../configuration/rappidEnviromentFunctionality/shared';

export const inspectorShapes = {

  // From this point defined different variables that build the attributes of the elements of the diagram.

  /**
   filter: Showed as a select-box with options as defined in shadowStyle. Used for essence definition.
   Appears in presentation group. Ordered first.
   stroke-dasharray: Showed as a select-box with options as defined in strokeStyle. Used for Affiliation definition.
   Appears in presentation group. Ordered second.
   fill: The color of the element. Picked from a color-palette. Appears in styling group.Ordered sixth.
   stroke: The color of the element's stroke. Picked from a color-palette. Appears in styling group.Ordered seventh.
   stroke-width: The width of the element's stroke. Picked from a range bar (0-30). Appears in styling group.Ordered eighth.
   */
  shapeDefinition: {
    'filter': createSelection('select', selectOptions.shadowStyle, 'Essence', 'presentation', 2),
    'stroke-dasharray': createSelection('select', selectOptions.strokeStyle, 'Affiliation', 'presentation', 2),
    fill: createColorsObject('Shape fill', 6),
    stroke: createColorsObject('Outline', 7),
    'stroke-width': createRangeObject(0, 30, 'Outline thickness', 8)
  },

  /*Definition of the element's text - content, color and size.
   text: The text that is shown on the element. Can be edited. Appears in text group.Ordered third.
   fill: The color of the text shown on the element. Can be selected from colorPalette. Appears in styling group.Ordered fourth.
   font-size: The size of the text shown on the element. Picked from a range bar. Appears in styling group.Ordered fifth.
   */
  textDefinition: {
    text: createTextContentObject('Text', 'text', 3),
    fill: createColorsObject('Text fill', 4),
    'font-size': createRangeObject(10, 80, 'Font size', 5)
  },

  falseDefinition: {  },

  valueDefinition: {
    'valueType' : createSelection('select-box', selectOptions.valueTypes, 'Type', 'computation', 9),
    'value': createTextContentObject('Value', 'computation', 10),
    'units' : createTextContentObject('Units', 'computation', 11),
  },

  functionDefinition: {
    'value': createSelection('select-box', selectOptions.predefinedFunctions, 'Function', 'computation', 9)
  },

  // From this point defined  the groups that all the inspector parameters are grouped by.
  groupsDefinition: {
    presentation: createGroup('Presentation', 1),
    text: createGroup('Text', 2),
    styling: createGroup('Styling', 3, true)
  },

  // Function CreateInspectorPart gets shapeName and needed definitions and generates suitable fields in the inspector.
  // Fits for object, process and state (doesn't fit for link)
  CreateInspectorShapesPart(shapeName, shapeDefinition, textDefinition, valueDefinition, groupsDefinition) {
    return {
      inputs: {
        attrs: {
          [shapeName]: shapeDefinition,
          text: textDefinition,
          value: valueDefinition,
        }
      },
      groups: groupsDefinition
    };
  }
};
