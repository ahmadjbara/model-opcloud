import {OpmFundamentalRelation} from '../../models/LogicalPart/OpmFundamentalRelation';
import {OpmFundamentalLink, TriangleClass} from '../../models/DrawnPart/Links/OpmFundamentalLink';
import {OpmTaggedRelation} from '../../models/LogicalPart/OpmTaggedRelation';
import {OpmProceduralRelation} from '../../models/LogicalPart/OpmProceduralRelation';
import {OpmLogicalState} from '../../models/LogicalPart/OpmLogicalState';
import {OpmLogicalProcess} from '../../models/LogicalPart/OpmLogicalProcess';
import {OpmState} from '../../models/DrawnPart/OpmState';
import {OpmProceduralLink} from '../../models/DrawnPart/Links/OpmProceduralLink';
import {OpmTaggedLink} from '../../models/DrawnPart/Links/OpmTaggedLink';
import {OpmProcess} from '../../models/DrawnPart/OpmProcess';
import {OpmLogicalObject} from '../../models/LogicalPart/OpmLogicalObject';
import {OpmObject} from '../../models/DrawnPart/OpmObject';
import {OpmDefaultLink} from "../../models/DrawnPart/Links/OpmDefaultLink";

export function addHandle(initRappidService, cell, opt) {
  if (opt.stencil) {
    initRappidService.cell$.next(cell);
  }
  if (cell instanceof OpmObject) {
    initRappidService.opmModel.add(new OpmLogicalObject(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmProcess) {
    initRappidService.opmModel.add(new OpmLogicalProcess(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmState) {
    initRappidService.opmModel.add(new OpmLogicalState(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmProceduralLink) {
    initRappidService.opmModel.add(new OpmProceduralRelation(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmTaggedLink) {
    initRappidService.opmModel.add(new OpmTaggedRelation(cell.getParams(), initRappidService.opmModel));
  } else if (cell instanceof OpmFundamentalLink) {
    initRappidService.opmModel.add(new OpmFundamentalRelation(cell.getParams(), initRappidService.opmModel));
  }
}
export function removeHandle(initRappidService, cell) {
  initRappidService.opmModel.remove(cell.id);
}
export function changeHandle(initRappidService, cell) {
  if (cell.constructor.name === 'TriangleClass') {
    updateFundamentalLinkFromTriengle(cell, initRappidService.opmModel);
  } else if (cell.constructor.name === 'OpmDefaultLink') {
    if (cell.getTargetElement() instanceof TriangleClass) {
      updateFundamentalLinkFromTriengle(cell.getTargetElement(), initRappidService.opmModel);
    }
  } else {
    const params = cell.getParams();
    const logicalElement = initRappidService.opmModel.getLogicalElementByVisualId(cell.get('id'));
    const visualElement = initRappidService.opmModel.getVisualElementById(cell.get('id'));
    if (logicalElement) logicalElement.updateParams(params);
    if (visualElement)  visualElement.updateParams(params);
    const opmModelJson = initRappidService.opmModel.toJson();
    const opmModelFromJson = initRappidService.opmModel.fromJson(opmModelJson);
  }
}
function updateFundamentalLinkFromTriengle(triangleCell, opmModel) {
  const outboundLinks = triangleCell.graph.getConnectedLinks(triangleCell, { outbound: true });
  for (let i = 0; i < outboundLinks.length; i++) {
    const params = outboundLinks[i].getParams();
    const visualElement = opmModel.getVisualElementById(outboundLinks[i].get('id'));
    if (visualElement)  visualElement.updateParams(params);
  }
}
