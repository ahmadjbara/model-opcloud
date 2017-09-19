const _ = require('lodash');
const joint = require('rappid');
const g = joint.g;

export const basicDefinitions = {

  stateWidth: 50,
  stateHeight: 25,
  defineLink() {
    return {
      defaults: _.defaultsDeep({
        type: 'opm.Link',
        attrs: {'.connection': {'stroke-width': 2, 'stroke-dasharray': '8 5'}},
        labels: [{position: 0.5, attrs: {text: {text: ''}}}]
      }, joint.dia.Link.prototype.defaults)
    };
  }
}
