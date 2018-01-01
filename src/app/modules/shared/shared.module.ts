import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { AvatarComponent } from './avatar/avatar.component';
import { ResizeBarDirective } from './resize-bar/resize-bar.directive';
import { ResizeBarComponent } from './resize-bar/resize-bar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    AvatarComponent,
    ResizeBarDirective
  ],
  declarations: [
    AvatarComponent,
    ResizeBarDirective,
    ResizeBarComponent
  ],
  entryComponents: [
    ResizeBarComponent
  ]
})
export class SharedModule {
}
