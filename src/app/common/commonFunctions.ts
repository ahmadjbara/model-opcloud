import { opmStyle } from '../configuration/rappidEnviromentFunctionality/opmStyle';
import {joint, _, paddingObject} from '../configuration/rappidEnviromentFunctionality/shared';


export const CommonFunctions = {

  updateProcessSize(fatherCell){
    var leftSideX = fatherCell.get('position').x;
    var topSideY = fatherCell.get('position').y;
    var rightSideX = fatherCell.get('position').x + fatherCell.get('size').width;
    var bottomSideY = fatherCell.get('position').y + fatherCell.get('size').height;

    var elps = joint.g.ellipse.fromRect(fatherCell.getBBox());
    _.each(fatherCell.getEmbeddedCells(), function(child) {

      var childBbox = child.getBBox();
      //Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object

      if (!elps.containsPoint(childBbox.bottomLeft())){
        bottomSideY = bottomSideY + paddingObject;
        leftSideX = leftSideX - paddingObject;
      }
      if (!elps.containsPoint(childBbox.origin())){
        topSideY = topSideY - paddingObject ;
        leftSideX = leftSideX - paddingObject;
      }
      if (!elps.containsPoint(childBbox.corner())){
        bottomSideY = bottomSideY+paddingObject;
        rightSideX = rightSideX + paddingObject;
      }
      if (!elps.containsPoint(childBbox.topRight())){
        topSideY = topSideY - paddingObject ;
        rightSideX = rightSideX + paddingObject;
      }
    });
    fatherCell.set({
      position: { x: leftSideX, y: topSideY },
      size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }},{skipExtraCall:true});
  }
};
