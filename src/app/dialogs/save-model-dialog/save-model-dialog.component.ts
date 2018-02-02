import { Component, OnInit, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ModelStorageInterface } from '../../rappid-components/services/storage/model-storage.interface';

@Component({
  selector: 'app-save-model-dialog',
  template: `
    <p>Save Model</p>
    <p>
      <label>
        Enter the model name
        <input #modelNameInput>
      </label>
    </p>
    <!--<p *ngIf="modelExists(modelNameInput.value)">-->
      <!--A model with this name exists. Override?-->
    <!--</p>-->
    <p> 
      <button md-button (click)="dialogRef.close(modelNameInput.value)">SAVE</button> 
      <button md-button (click)="dialogRef.close()">CANCEL</button> 
    </p>
  `,
  styleUrls: ['./save-model-dialog.component.css']
})
export class SaveModelDialogComponent implements OnInit {
  models;

  constructor(
    @Optional() public dialogRef: MdDialogRef<SaveModelDialogComponent>,
    private modelStorageService: ModelStorageInterface) {

    this.models = modelStorageService.getModels();
  }

  ngOnInit() {
  }

  modelExists(modelName) {
    return (this.models.indexOf(modelName) !== -1);
  }

}
