import {OpmLink} from './OpmLink';

export  class OpmProceduralLink extends OpmLink {
  constructor(markerSource, markerTarget, strokeColor, name) {
    super();
    this.attr({'.connection': {stroke: strokeColor}}, {'.marker-source': markerSource}, {'.marker-target': markerTarget});

  }
}
