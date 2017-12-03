import { Component, OnInit, Optional } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { OplService } from '../../opl-generation/opl.service';
import { PipeTransform, Pipe } from '@angular/core';



@Component({
  selector: 'opcloud-opl-dialog',
  template: `
      <h1>OPL table</h1>
      <p>select your language
      <select [(ngModel)]="language">
        <option *ngFor="let lan of availableLanguage" [value]="lan">
          {{lan}}
        </option>
      </select></p>

      <md-dialog-content>
          <table *ngFor="let relation of oplTable | keys" >

              <tr><th colspan="2">{{relation.key}}</th></tr>
              <tr *ngFor="let link of relation.value | keys">
                <td class="tdKey">{{link.key}}</td>
                <td>

                  <span (click)="edit=true" *ngIf="!edit" class="tdValue">{{ link.value }} </span>"
                  <input *ngIf="edit"
                         (keyup.enter)="changeReservedPhrase(relation.key, link.key, $event); edit=false"
                         [value]=link.value class="tdValue">

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
  public edit: boolean[];

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
  }
  changeLanguage(selected) {
    this.language = selected;
    console.log(this.language);
  }
  updateTable(lan) {
    this.oplTable = this.oplService.getOplTable(lan);
  }
  changeReservedPhrase(relation, link, event) {
    this.oplTable[relation][link] = event.target.value;
    const element = event.srcElement.nextElementSibling;
    if (element == null) {
      return;
    } else {
      element.focus();
    }
  }
  saveTable() {
    this.oplService.changeOplTable(this.language, this.oplTable);
    this.dialogRef.close();
  }
  cancelTableChange() {
    this.updateTable(this.language);
    this.dialogRef.close();
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
