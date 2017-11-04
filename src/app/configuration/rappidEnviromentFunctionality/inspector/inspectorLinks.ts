import { selectOptions } from './selectOptions';
import {createSelection} from '../shared';
import {createGroup} from './inspector.config';

export const inspectorLinks = {
  // From this point defined  the groups that all the inspector parameters are grouped by.
  groupsDefinition: {
    marker: createGroup('Style', 1),
    labels: createGroup('Labels', 2)
  },

  linkDefinition: {
  },
  LinkRouter: {
    name: createSelection('select-box', selectOptions.LinkRouter, 'Router', 'Style', 1),
  },

  LinkConnector: {
    name: createSelection('select-box', selectOptions.LinkConnector, 'Connector', 'Style', 1),

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
