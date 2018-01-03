import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app/app.component';
import { RappidModule } from './rappid.module';
import { SaveModelDialogComponent } from '../dialogs/save-model-dialog/save-model-dialog.component';
import { LoadModelDialogComponent } from '../dialogs/load-model-dialog/load-model-dialog.component';

import { AngularFireModule } from 'angularfire2';
import { ModelStorageInterface } from '../rappid-components/services/storage/model-storage.interface';
import { ModelFbStorageService } from '../rappid-components/services/storage/model-fb-storage.service';

import { TreeViewService } from '../rappid-components/services/tree-view.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { MaterialModule } from './shared/material.module';

import 'hammerjs';
import { CoreModule } from './core.module';
import { SharedModule } from './shared/shared.module';
import { UserService } from '../rappid-components/services/user.service';
import { environment } from '../../environments/environment.airbus';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Tab } from '../dialogs/choose-link-dialog/tab';
import { Tabs } from '../dialogs/choose-link-dialog/tabs';
import { DialogComponent } from '../dialogs/choose-link-dialog/Dialog.component';
import {AboutDialogComponent} from '../dialogs/About/about';
import { OplDialogComponent } from '../dialogs/opl-dialog/opl-dialog.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import {UploadFile} from "../dialogs/FileUploader/FileUploader";
import {ProgressSpinner} from "../dialogs/Spinner/Progress_Spinner";
import {ClearCanvasComponent} from '../dialogs/clear-canvas/clear-canvas';
import {KeysPipe} from '../dialogs/opl-dialog/opl-dialog.component';
import { OplService } from "../opl-generation/opl.service";


@NgModule({
  declarations: [
    AppComponent,
    SaveModelDialogComponent,
    LoadModelDialogComponent,
    DialogComponent,
    AboutDialogComponent,
    ClearCanvasComponent,
    OplDialogComponent,
    Tabs,
    Tab,
    FileSelectDirective, /** The FileSelectDirective is what we will require , Drop is an option too*/
    FileDropDirective,
    UploadFile,
    ProgressSpinner,
    KeysPipe

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RappidModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseCredentials),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    CoreModule,
    SharedModule,

    // AppRoutingModule
  ],
  providers: [
    { provide: ModelStorageInterface, useClass: ModelFbStorageService },
    TreeViewService,
    UserService,
    OplService
  ],
  entryComponents: [
    SaveModelDialogComponent,
    LoadModelDialogComponent,
    DialogComponent,
    OplDialogComponent,
    AboutDialogComponent,
    UploadFile,
    ProgressSpinner,
    ClearCanvasComponent,
    AboutDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
