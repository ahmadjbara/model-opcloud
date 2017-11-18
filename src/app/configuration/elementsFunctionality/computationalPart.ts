import {ConsumptionLink} from '../../models/DrawnPart/Links/ConsumptionLink';
import {InstrumentLink} from '../../models/DrawnPart/Links/InstrumentLink';
import {ResultLink} from '../../models/DrawnPart/Links/ResultLink';
import {vectorizer} from '../rappidEnviromentFunctionality/shared';

export function compute(inbound, outbound, paper, functionValue, linkViewsArray) {
  // filter inbound links to include only consumption and instrument links
  inbound = inbound.filter(link => ((link instanceof InstrumentLink) ||
    (link instanceof ConsumptionLink)));
  // filter outbound links to include only the result links
  outbound = outbound.filter(link => (link instanceof ResultLink));
  // sort all input links to have all connected objects ordered from left to right
  inbound = inbound.sort((l1, l2) => l1.getSourceElement().get('position').x - l2.getSourceElement().get('position').x);
  const valuesArray = new Array();
  for (let i = 0; i < inbound.length; i++) {
 //   const token = vectorizer.V('circle', {r: 5, fill: 'green', stroke: 'red'});
    const sourceElement = inbound[i].getSourceElement();
    if (sourceElement.get('logicalValue') !== null) {
    //if ((sourceElement.attr('value/valueType') !== 'None') &&
    //  (sourceElement.attr('value/value') !== 'None')) {
  //    inbound[i].findView(paper).sendToken(token.node, 1000, function() {
  //      console.log('cb');
  //    });
      linkViewsArray.push(inbound[i].findView(paper));
      valuesArray.push(sourceElement.get('logicalValue'));
    }
  }
  let resultValue;
  if (functionValue === 'Add') {
    resultValue = add(valuesArray);
  } else if (functionValue === 'Subtract') {
    resultValue = subtract(valuesArray);
  } else if (functionValue === 'Multiply') {
    resultValue = multiply(valuesArray);
  } else if (functionValue === 'Divide') {
    resultValue = divide(valuesArray);
  }
  if (resultValue) {
    for (let j = 0; j < outbound.length; j++) {
  //    const token = vectorizer.V('circle', {r: 5, fill: 'green', stroke: 'red'});
      const targetElement = outbound[j].getTargetElement();
      targetElement.set('logicalValue', resultValue.toString());
 //     outbound[j].findView(paper).sendToken(token.node, 1000, function() {
 //     });
      linkViewsArray.push(outbound[j].findView(paper));
   //   targetElement.attr({value: {value: resultValue.toString(), valueType: 'Number'}});
    }
  }
}
function add(valuesArray) {
  // convert the elements from strings to numbers
  const numbersArray = valuesArray.map(item => +item);
  // sum the values of the array
  return numbersArray.reduce((a, b) => a + b);
}
function subtract(valuesArray) {
  // convert the elements from strings to numbers
  const numbersArray = valuesArray.map(item => +item);
  // subtract the right values of the array from the most left value
  return numbersArray.reduce((a, b) => a - b);
}
function multiply(valuesArray) {
  // convert the elements from strings to numbers
  const numbersArray = valuesArray.map(item => +item);
  // multiply the values of the array
  return numbersArray.reduce((a, b) => a * b);
}
function divide(valuesArray) {
  // convert the elements from strings to numbers
  const numbersArray = valuesArray.map(item => +item);
  // divide the left value of the array by the right value
  return numbersArray.reduce((a, b) => a / b);
}
function wait(ms) {
  console.log('start wait');
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
  console.log('end wait');
}
