import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RappidToolbarComponent } from '../rappid-components/rappid-toolbar/rappid-toolbar.component';
import { RappidStencilComponent } from '../rappid-components/rappid-stencil/rappid-stencil.component';
import { RappidPaperComponent } from '../rappid-components/rappid-paper/rappid-paper.component';
import { GraphService } from '../rappid-components/services/graph.service';
import { RappidInspectorComponent } from '../rappid-components/rappid-inspector/rappid-inspector.component';
import { RappidNavigatorComponent } from '../rappid-components/rappid-navigator/rappid-navigator.component';
import { CommandManagerService } from '../rappid-components/services/command-manager.service';
import { RappidOplComponent } from '../rappid-components/rappid-opl/rappid-opl.component';
import { TreeModule } from 'angular-tree-component';
import { OPDHierarchyComponent } from '../opd-hierarchy/opd-hierarchy.component';
import { InitRappidService } from '../rappid-components/services/init-rappid.service';
import { MdButtonModule, MdIconModule, MdTooltipModule } from '@angular/material';

@NgModule({
  imports: [

    CommonModule,
    TreeModule,
    MdIconModule,
    MdButtonModule,
    MdTooltipModule,
    MdIconModule,

  ],
  declarations: [
    RappidToolbarComponent,
    RappidStencilComponent,
    RappidPaperComponent,
    RappidInspectorComponent,
    RappidNavigatorComponent,
    RappidOplComponent,
    OPDHierarchyComponent
  ],
  providers: [
    GraphService,
    CommandManagerService,
    InitRappidService
  ],
  exports: [
    RappidToolbarComponent,
    RappidToolbarComponent,
    RappidStencilComponent,
    RappidPaperComponent,
    RappidInspectorComponent,
    RappidNavigatorComponent,
    RappidOplComponent,
    OPDHierarchyComponent
  ]
})
export class RappidModule { }
