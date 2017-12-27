import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { MdDialog } from '@angular/material';
import { LoadModelDialogComponent } from '../../dialogs/load-model-dialog/load-model-dialog.component';
import { CommandManagerService } from '../services/command-manager.service';
import { InitRappidService } from '../services/init-rappid.service';
import {AboutDialogComponent} from '../../dialogs/About/about';
import {UserService} from '../services/user.service';
import {SignInComponent} from '../../modules/layout/header/sign-in/sign-in.component';


const commandGroups = [
  {
    group: 'editor',
    commands: [
      { name: 'undo', tooltip: 'undo', icon: 'undo' },
      { name: 'redo', tooltip: 'redo', icon: 'redo' }
    ]
  },
  {
    group: 'file',
    commands: [
      { name: 'executeIfLogged(saveModel)', tooltip: 'save', icon: 'save' },
      { name: 'executeIfLogged(loadModel)', tooltip: 'load', icon: 'open_in_browser' }
    ]
  },
  {
    group: 'zoom',
    commands: [
      { name: 'zoomin', tooltip: 'zoom in', icon: 'zoom_in' },
      { name: 'zoomout', tooltip: 'zoom out', icon: 'zoom_out' },
      { name: 'zoomtofit', tooltip: 'zoom to fit', icon: 'zoom_out_map' },
      { name: 'zoomtodefault', tooltip: 'default zoom', icon: 'youtube_searched_for' },
      { name: 'about', tooltip: 'About', icon: 'info' },
      { name: 'execute', tooltip: 'execute', icon: 'send' }
    ]
  }
];


@Component({
  selector: 'opcloud-rappid-toolbar',
  template: `
    <div class="button-row">
      <div class="button-group" *ngFor="let commandGroup of commandGroups">
        <button *ngFor="let command of commandGroup.commands"
                md-mini-fab
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
  commandGroups = commandGroups;

  constructor(
    private graphService: GraphService,
    commandManagerService: CommandManagerService,
    private initRappidService: InitRappidService,
    private userService: UserService,
    private viewContainer: ViewContainerRef,
    private _dialog: MdDialog) {
    this.commandManager = commandManagerService.commandManager;
  }

  ngOnInit() {
    this.graph = this.graphService.getGraph();
  }

  buttonClick(command) {
    let func = command.name.substring(0,command.name.indexOf("("));
    let args = command.name.substring(command.name.indexOf("(")+1,command.name.indexOf(")"));
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

  saveModel() {
    const modelInDb = this.graphService.modelStorage.models.includes(this.graphService.modelObject.name);
    if ((this.graphService.modelObject.name === null) || !modelInDb) {
      return this.saveModelAs();
    }
    return this.graphService.saveGraph(this.graphService.modelObject.name, false);
  }

  saveModelAs() {
    const result = prompt('Save Model As:', 'Enter a Model Name');
    if (result === 'Enter a Model Name' || result === null) {
      console.log('Model not saved');
      return;
    }
    this.graphService.saveGraph(result, true);
  }

  loadModel() {
    const dialogRef = this._dialog.open(LoadModelDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.graphService.loadGraph(result);
        this.graphService.modelObject.name = result;
      }
    });
  }

  executeIfLogged(func){
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
  execute() {
    // start execute from SD graph
    this.initRappidService.changeGraphToSD();
    // array that contains all the link views needed to be visualized by a token
    const linksArray = [];
    this.graphService.execute(this.initRappidService, linksArray);
    this.graphService.showExecution(this.initRappidService, linksArray, 0);
  }
}
