import { selectOptions } from './selectOptions';
import {CommonFunctions} from "../common/commonFunctions";

export const inspectorShapes = {

  //From this point defined different variables that build the attributes of the elements of the diagram.

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
    'filter': CommonFunctions.createSelection('select', selectOptions.shadowStyle, 'Essence', 'presentation', 2),
    'stroke-dasharray': CommonFunctions.createSelection('select', selectOptions.strokeStyle, 'Affiliation', 'presentation', 2),
    fill: CommonFunctions.createColorsObject('Shape fill', 6),
    stroke: CommonFunctions.createColorsObject('Outline', 7),
    'stroke-width': CommonFunctions.createRangeObject(0, 30, 'Outline thickness', 8)
  },

  /*Definition of the element's text - content, color and size.
   text: The text that is shown on the element. Can be edited. Appears in text group.Ordered third.
   fill: The color of the text shown on the element. Can be selected from colorPalette. Appears in styling group.Ordered fourth.
   font-size: The size of the text shown on the element. Picked from a range bar. Appears in styling group.Ordered fifth.
   */
  textDefinition: {
    text: CommonFunctions.createTextContentObject('Text', 'text', 3),
    fill: CommonFunctions.createColorsObject('Text fill', 4),
    'font-size': CommonFunctions.createRangeObject(10, 80, 'Font size', 5)
  },

  falseDefinition: {  },

  valueDefinition: {
    'valueType' : CommonFunctions.createSelection('select-box', selectOptions.valueTypes, 'Type', 'computation', 9),
    'value': CommonFunctions.createTextContentObject('Value', 'computation', 10),
    'units' : CommonFunctions.createTextContentObject('Units', 'computation', 11),
  },

  functionDefinition: {
    'value': CommonFunctions.createSelection('select-box', selectOptions.predefinedFunctions, 'Function', 'computation', 9)
  },

  //From this point defined  the groups that all the inspector parameters are grouped by.
  groupsDefinition: {
    presentation: CommonFunctions.createGroup('Presentation', 1),
    text: CommonFunctions.createGroup('Text', 2),
    styling: CommonFunctions.createGroup('Styling', 3, true)
  }
};
