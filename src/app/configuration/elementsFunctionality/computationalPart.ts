import {ConsumptionLink} from '../../models/DrawnPart/Links/ConsumptionLink';
import {InstrumentLink} from '../../models/DrawnPart/Links/InstrumentLink';
import {ResultLink} from '../../models/DrawnPart/Links/ResultLink';
import {vectorizer} from '../rappidEnviromentFunctionality/shared';

export function compute(process, paper, linksArray, treeNodeId) {
  // get the inbound links
  let inbound = paper.model.get('cells').graph.getConnectedLinks(process, {inbound: true});
  // filter inbound links to include only consumption and instrument links
  inbound = inbound.filter(link => ((link instanceof InstrumentLink) ||
    (link instanceof ConsumptionLink)));
  // sort all input links to have all connected objects ordered from left to right
  inbound = inbound.sort((l1, l2) => l1.getSourceElement().get('position').x - l2.getSourceElement().get('position').x);
  // get the outbound links
  let outbound = paper.model.get('cells').graph.getConnectedLinks(process, {outbound: true});
  // filter outbound links to include only the result links
  outbound = outbound.filter(link => (link instanceof ResultLink));
  const valuesArray = new Array();
  for (let i = 0; i < inbound.length; i++) {
    const sourceElement = inbound[i].getSourceElement();
    if (sourceElement.get('logicalValue') !== null) {
      const link = inbound[i];
      linksArray.push({link, treeNodeId});
      valuesArray.push(sourceElement.get('logicalValue'));
    }
  }
  let resultValue;
  const functionValue = process.attr('value/value');
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
      const targetElement = outbound[j].getTargetElement();
      targetElement.set('logicalValue', resultValue.toString());
      const link = outbound[j];
      linksArray.push({link, treeNodeId});
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
