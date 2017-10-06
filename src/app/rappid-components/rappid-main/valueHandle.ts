import * as common from "../../common/commonFunctions";
import { addState } from '../../config/add-state';

export const valueHandle = {

    //When a value of an object is updated, if a state exists - its value will be updates, otherwise - a new state will be added with the new value
    updateState(graph, cell, value){
        cell.set('previousValue', value);
        var statesNumber = 0;   //currently only one value for object is allowed
        common._.each(cell.getEmbeddedCells(), function(child) {
            statesNumber ++;
            //There is already a state with the value set to the object - no need to update
            child.attr({text: {text: value}});
        });
        //If got to this line then it means that there is no state yet and need to add a new state
        if(statesNumber == 0) {
            addState.call(this);
            common._.each(cell.getEmbeddedCells(), function (child) {child.attr({text: {text: value}});});
        }
    },

    updateUnits(cell, units){
        cell.set('previousUnits', units);
        var newText = cell.attributes.attrs.text.text;
        var indexOfStartUnits = newText.lastIndexOf('[');
        if(indexOfStartUnits>0){    //At the first time it will be -1, meaning no units were  defined yet
            newText  = newText.substring(0, indexOfStartUnits) + '[' + units +']';
        }
        else {
            newText = newText + '\n[' + units + ']';
        }
        cell.attr({text: {text: newText}});
    },

    updateCell(graph, cell){
        var value = cell.attributes.attrs.value.value;
        var valueType = cell.attributes.attrs.value.valueType;
        var units = cell.attributes.attrs.value.units;
        var cellType = cell.attributes.type;
        if(cell.attributes.type == 'opm.Object') {
          if ((!cell.get('previousValue') || (value != cell.get('previousValue'))) && (value != 'None')) {
            this.updateState(graph, cell, value);
          }
          if ((!cell.get('previousUnits') || (units != cell.get('previousUnits'))) && (units != '')) {
            this.updateUnits(cell, units);
          }
        }
    }
}
