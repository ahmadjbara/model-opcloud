import {OpmFundamentalRelation} from '../../models/LogicalPart/OpmFundamentalRelation';
import {OpmFundamentalLink} from '../../models/DrawnPart/Links/OpmFundamentalLink';
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
