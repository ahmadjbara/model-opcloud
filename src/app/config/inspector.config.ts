import { inspectorShapes } from './inspectorShapes';
import { inspectorLinks } from './inspectorLinks';

export const inspectorConfig = {
  // object parameters
  'opm.Object': inspectorShapes.CreateInspectorShapesPart('rect', inspectorShapes.shapeDefinition,
    inspectorShapes.textDefinition, inspectorShapes.valueDefinition, inspectorShapes.groupsDefinition),
  // process parameters
  'opm.Process': inspectorShapes.CreateInspectorShapesPart('ellipse', inspectorShapes.shapeDefinition,
    inspectorShapes.textDefinition, inspectorShapes.functionDefinition, inspectorShapes.groupsDefinition),
  // state parameters
  'opm.State': inspectorShapes.CreateInspectorShapesPart('rect', inspectorShapes.falseDefinition,
    inspectorShapes.textDefinition, inspectorShapes.falseDefinition, inspectorShapes.groupsDefinition),
  // link parameters
  'opm.Link': {
    inputs: {
      attrs: inspectorLinks.linkDefinition,
      labels: inspectorLinks.labelDefinition
    },
    groups: inspectorLinks.groupsDefinition
  }
};
// Function createGroup. Get the name of the group, its index and if it should be collapsed and generates a group object
// Function createGroup. Get the name of the group, its index and if it should be collapsed and generates a group object
export function createGroup(labelName, indexNumber, isClosed = false) {
  return {
    label: labelName,
    index: indexNumber,
    closed: isClosed
  };
}
