import { selectOptions } from './selectOptions';
import {createSelection} from '../shared';
import {createGroup} from './inspector.config';

export const inspectorLinks = {
  // From this point defined  the groups that all the inspector parameters are grouped by.
  groupsDefinition: {
    marker: createGroup('Marker', 1),
    labels: createGroup('Labels', 2)
  },

  linkDefinition: {
    '.marker-source': createSelection('select-box', selectOptions.SourceLinkType, 'source link type', 'Marker', 1),
    '.marker-target': createSelection('select-box', selectOptions.DestLinkType, 'destination link type', 'Marker', 2),
  },

  labelDefinition: [{
    position: createSelection('select-box', selectOptions.labelPosition, 'Position', 'Labels', 4),
    attrs: {
      text: {
        text: {
          group: 'Labels',
          type: 'text',
          label: 'text',
          index: 3
        }
      }
    }
  }]
};
