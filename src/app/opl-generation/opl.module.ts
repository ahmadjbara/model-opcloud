import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OplElementComponent } from './opl-element/opl-element.component';
import { OplSentenceComponent } from './opl-sentence/opl-sentence.component';
import { OplParagraphComponent } from './opl-paragraph/opl-paragraph.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [

  OplElementComponent,

  OplSentenceComponent,

  OplParagraphComponent],
  providers: [

  ],
  exports: [

  ]
})
export class OplModule { }
