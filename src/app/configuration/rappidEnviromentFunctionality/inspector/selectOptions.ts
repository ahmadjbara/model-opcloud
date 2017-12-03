// selectOptions is an object containing different options types for select-boxes that describe the different elements of the diagram
export const selectOptions = {

  // with (Physical) or without (Informatical) shadow
  shadowStyle: [
    {content: 'Physical', value: {name: 'dropShadow', args: {dx: 3, dy: 3, blur: 0, color: 'grey'}} },
    {content: 'Informatical', value: {name: 'dropShadow', args: {dx: 0, dy: 0, blur: 0, color: 'grey'}}}
  ],
  // dashed (Environmental) or not (Systemic) stroke
  strokeStyle: [
    {value: '0', content: 'Systemic'},
    {value: '10,5', content: 'Environmental'}
  ],
  SourceLinkType: [
    {value: {d: ''}, content: 'None'},
    {value: {fill: '#f2f2f2', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25 L 10,25', 'stroke-width': 2}, content: 'Consumption Link'},
    {value: { fill: 'blue' ,d: 'M 8 34 L -12 25 L 8 16 L-12 25 L 8 34 M -12,25 L 10,25', 'stroke-width': 2}, content: 'Unidirectional Link' }
  ],

  DestLinkType: [
    {value: {fill: '#f2f2f2', d: 'M 8,33 L -12,25 L 8,17 L0,25 L 8,33 M 0,25 L 10,25', 'stroke-width': 2}, content: 'Result Link'},
    {value: {fill: '#f2f2f2', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0 L 25,0', 'stroke-width': 2}, content: 'Instrument Link'},
    {value: {fill: '#000000', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0 L 25,0', 'stroke-width': 2}, content: 'Agent Link'},
    {value: { fill: '#000000', d: 'M64 48 L64 16 L30 32 L64 48','stroke-width': 2, 'stroke': '#000000'}, content: 'Aggregation-Participation Link' },
    {value: { fill: 'white', d: 'M64 48 L64 16 L30 32 L64 48','stroke-width': 2, 'stroke': 'black'}, content: 'Specialization Link'},
    {value: { fill: 'black', d: 'M58 48 L58 16 Z M58 16 L24 32 Z M24 32 L58 48 Z M34 32 L52 24 L52 40 L34 32 Z','stroke-width': 2, 'stroke': '#000000'}, content: 'Characterization Link' },
    {value: { fill: 'white', d: 'M64 48 L64 16 L30 32 L64 48 M 48 32 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0','stroke-width': 2, 'stroke': '#000000'}, content: 'Classification Link' },
    {value: { fill: 'black', d: 'M 32 46  L40 32  L48 16  M40 31 L16 31', 'stroke-width': 2}, content: 'Exception Link' },
    {value: { fill: 'black', d: 'M 8 34 L -12 25 L 8 16 L-12 25 L 8 34 M -12,25 L 10,25', 'stroke-width': 2}, content: 'Unidirectional Link' },
    {value: { fill: 'black', d: 'M 8,33 L -12,25 L 8,33 L-12,25 Z', 'stroke-width': 2}, content: 'Bidirectional Link' },
    {value: { fill: '#f2f2f2', d: 'M-12 43 L-32 35 L-12 27 L-20 35 L-12 43 M-20 35 M8 35 L-20 35 M-2 22 L36 22 L-2 22 L8 35','stroke-width': 2}, content: 'Invocation Link'}
  ],

  labelPosition: [
    {value: 30, content: 'Close to source'},
    {value: 0.5, content: 'In the middle'},
    {value: -30, content: 'Close to target'},
  ],

  predefinedFunctions: [
    {content: 'None', value: 'None'},
    {content: 'Adding', value: 'Adding'},
    {content: 'Subtracting', value: 'Subtracting'},
    {content: 'Multiplying', value: 'Multiplying'},
    {content: 'Dividing', value: 'Dividing'}
  ],

  valueTypes: [
    {content: 'None', value: 'None'},
    {content: 'Number', value: 'Number'},
    {content: 'String', value: 'String'}
  ],
  LinkRouter:[
    {value : 'normal' , content:'normal'},
    {value : 'manhattan' , content:'manhattan'},
    {value : 'oneSide' , content:'oneSide'},
    {value : 'metro' , content:'metro'},
    {value : 'orthogonal' , content:'orthogonal'}
  ],

  LinkConnector:[
    {value : 'normal' , content:'normal'},
    {value : 'smooth' , content:'smooth'},
    {value : 'rounded' , content:'rounded'},
    {value : 'jumpover' , content:'jumpover'}
  ],
};
