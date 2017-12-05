import { Component, OnInit, Optional } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { OplService } from '../../opl-generation/opl.service';
import { PipeTransform, Pipe } from '@angular/core';



@Component({
  selector: 'opcloud-opl-dialog',
  template: `
      <h1>OPL table</h1>
      <p>select your language
      <select [(ngModel)]="language" name="selectLan" (click)="updateTable(language)">
        <option *ngFor="let lan of availableLanguage" [attr.value]="lan">
          {{lan}}
        </option>
      </select></p>

      <md-dialog-content>
          <table *ngFor="let relation of oplTable | keys" >

              <tr><th colspan="2">{{relation.key}}</th></tr>
              <tr *ngFor="let link of relation.value | keys">
                <td class="tdKey">{{link.key}}</td>
                <td>

                  <span (click)="edit[relation.key][link.key]=true"
                        *ngIf="!edit[relation.key][link.key]" class="tdValue">{{ link.value }} </span>

                  <input *ngIf="edit[relation.key][link.key]"
                         [value]="oplTable[relation.key][link.key]"
                         [(ngModel)]="oplTable[relation.key][link.key]">

                </td>
              </tr>
          </table>
        <button (click)="saveTable()">save</button><button (click)="cancelTableChange()">cancel</button>
      </md-dialog-content>
  `,
  styleUrls: ['./opl-dialog.component.css']
})


export class OplDialogComponent implements OnInit {

  public oplTable;
  public language;
  public availableLanguage;
  private oplService;
  public edit = {};
//  private translate = require('google-translate-api');

  constructor(
    oplService: OplService,
    @Optional() public dialogRef: MdDialogRef<OplDialogComponent>) {
    this.oplService = oplService;
    this.oplTable = oplService.getOplTable('en');
    this.language = 'en';
    this.availableLanguage = oplService.getAvailableLanguage();

  }

  ngOnInit() {
    this.updateTable( this.language );
    this.initiateEdit();
    console.log(this.edit);
  }
  updateTable(lan) {
    this.oplTable = this.oplService.getOplTable(lan);
  }
  saveTable() {
    this.oplService.changeOplTable(this.language, this.oplTable);
    console.log(this.oplTable,this.language);
    this.dialogRef.close();
  }
  cancelTableChange() {
    this.updateTable(this.language);
    this.dialogRef.close();
  }
  initiateEdit() {
    for (const relation of Object.keys(this.oplTable)){
      this.edit[relation] = {};
      for (const link of Object.keys(this.oplTable[relation])){
        this.edit[relation][link] = false;
      }
    }
  }
}

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    let key;
    for ( key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}


//<input type="text" [value]="link.value" class="tdValue"
//  [(ngModel)]="link.value"
//(keyup.enter)="changeReservedPhrase(relation.key, link.key, $event)">
