import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OplElementComponent } from './opl-element/opl-element.component';
import { OplSentenceComponent } from './opl-sentence/opl-sentence.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [

  OplElementComponent,

  OplSentenceComponent],
  providers: [

  ],
  exports: [

  ]
})
export class OplModule { }
