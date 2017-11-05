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

