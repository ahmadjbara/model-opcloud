import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { CoreModule } from './core.module';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CoreModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
