import {Component, OnInit, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { GraphService } from '../services/graph.service';
import { MdDialog } from '@angular/material';
import { LoadModelDialogComponent } from '../../dialogs/load-model-dialog/load-model-dialog.component';
import { CommandManagerService } from '../services/command-manager.service';
import { InitRappidService } from '../services/init-rappid.service';
import {AboutDialogComponent} from '../../dialogs/About/about';
import {UploadFile} from "../../dialogs/FileUploader/FileUploader";
import {ProgressSpinner} from "../../dialogs/Spinner/Progress_Spinner";
import {ClearCanvasComponent} from '../../dialogs/clear-canvas/clear-canvas';
import {UserService} from '../services/user.service';
import {SignInComponent} from '../../modules/layout/header/sign-in/sign-in.component';

const parseString = require('xml2js').parseString;


const commandGroups = [
  {
    group: 'editor',
    commands: [
      { name: 'undo', tooltip: 'Undo', icon: 'undo' },
      { name: 'redo', tooltip: 'Redo', icon: 'redo' },
      { name: 'clearcanvas', tooltip: 'Clear Canvas', icon: 'delete_sweep' }
    ]
  },
  {
    group: 'file',
    commands: [

      { name: 'importModel', tooltip: 'Import/Export opx Model', icon: 'import_export' },
     // { name: 'executeIfLogged(saveModel)', tooltip: 'save', icon: 'save' },
     // { name: 'executeIfLogged(loadModel)', tooltip: 'load', icon: 'open_in_browser' }
      { name: 'executeIfLogged(saveModel)', tooltip: 'Save', icon: 'save' },
      { name: 'executeIfLogged(loadModel)', tooltip: 'Load', icon: 'open_in_browser' }
    ]
  },
  {
    group: 'zoom',
    commands: [
      { name: 'zoomin', tooltip: 'Zoom In', icon: 'zoom_in' },
      { name: 'zoomout', tooltip: 'Zoom Out', icon: 'zoom_out' },
      { name: 'zoomtofit', tooltip: 'Zoom to Fit', icon: 'zoom_out_map' },
      { name: 'zoomtodefault', tooltip: 'Default Zoom', icon: 'youtube_searched_for' },
      { name: 'about', tooltip: 'About', icon: 'info' },
      { name: 'execute', tooltip: 'Execute', icon: 'send' }
    ]
  }
];


@Component({
  selector: 'opcloud-rappid-toolbar',
  template: `
    <div class="button-row">
      <div class="button-group" *ngFor="let commandGroup of commandGroups">
        <button *ngFor="let command of commandGroup.commands"
                md-mini-fab [disabled]="command.icon === 'undo' || command.icon === 'redo'" 
                [mdTooltip]="command.tooltip"
                class="button"
                (click)="buttonClick(command)">
          <md-icon>{{command.icon}}</md-icon>
        </button>
      </div>
      
    </div>
  `,
  styleUrls: ['./rappid-toolbar.component.scss']
})
export class RappidToolbarComponent implements OnInit {
  graph;
  // modelName;
  private commandManager;
  private  OPX_JSON : any;
  commandGroups = commandGroups;



  constructor(
    private graphService: GraphService,
    commandManagerService: CommandManagerService,
    private initRappidService: InitRappidService,
    private _dialog: MdDialog ,
    private userService: UserService,
    private componentFactoryResolver?: ComponentFactoryResolver,
    private viewContainer?: ViewContainerRef) {
    this.commandManager = commandManagerService.commandManager;
  }

  ngOnInit() {
    this.graph = this.graphService.getGraph();
  }

  buttonClick(command) {
    const func = command.name.substring(0, command.name.indexOf('(')) || command.name;
    const args = command.name.substring(command.name.indexOf('(') + 1, command.name.indexOf(')')) || '';
    return this[func](args);
  }


  undo() {
    this.commandManager.undo();
    this.graphService.updateJSON();
  }

  redo() {
    this.commandManager.redo();
    this.graphService.updateJSON();
  }

  spinner() {
    let SpinnerComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(ProgressSpinner);
    let SpinnerComponentRef = this.viewContainer.createComponent(SpinnerComponentFactory);
    return SpinnerComponentRef;
  }
  importModel() {
    let dialogRef = this._dialog.open(UploadFile);


    let That = this;

    dialogRef.afterClosed().subscribe(result => {

        parseString(result, function (err, result) {
          That.OPX_JSON = result
         // That.spinner();
          console.log(That.OPX_JSON);

        });

      this.graphService.importOpxGraph(this.OPX_JSON , this.initRappidService);

      });

}



  saveModel() {
    this.initRappidService.saveModel(this.graphService.modelStorage);
  }
  loadModel() {
    const dialogRef = this._dialog.open(LoadModelDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.initRappidService.loadModel(result, this.graphService.modelStorage);
      }
    });
  }

  executeIfLogged(func) {
    if (this.userService.isUserLoggedIn$) {
      return this[func]();
    }else{
      this._dialog.open(SignInComponent, {
        viewContainerRef: this.viewContainer,
      });
    }
  }

  zoomin() {
    this.initRappidService.paperScroller.zoom(0.2, { max: 4 });
  }

  zoomout() {
    this.initRappidService.paperScroller.zoom(-0.2, { min: 0.2 });
  }

  zoomtofit() {
    this.initRappidService.paperScroller.zoomToFit();
  }

  zoomtodefault() {
    this.initRappidService.paperScroller.zoom(1, { absolute: true });
  }

  about() {
    const dialogRef = this._dialog.open(AboutDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {

      }
    });
  }

  clearcanvas() {
    const dialogRef = this._dialog.open(ClearCanvasComponent);
    //context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    dialogRef.afterClosed().subscribe(result => {
      if (result==='clear') {
        this.graph.resetCells([]);
     }
    });
  }

  execute() {
    // start execute from SD graph
    this.initRappidService.changeGraphToSD();
    // array that contains all the link views needed to be visualized by a token
    const linksArray = [];
    this.graphService.execute(this.initRappidService, linksArray);
    this.graphService.showExecution(this.initRappidService, linksArray, 0);
  }
}
