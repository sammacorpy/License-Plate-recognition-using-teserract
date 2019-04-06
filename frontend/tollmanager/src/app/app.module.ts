import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitplateComponent } from './initplate/initplate.component';
import { LoginComponent } from './login/login.component';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {AngularFireAuthModule } from '@angular/fire/auth';
import {AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment.prod';
import { LoginService } from './login.service';
import { AuthService } from './auth.service';
import { HomepageComponent } from './homepage/homepage.component';
import { TakesnapshotService } from './takesnapshot.service';
import { TopnavComponent } from './topnav/topnav.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MainComponent } from './main/main.component';
import { HttpModule } from '@angular/http';

import { JwSocialButtonsModule } from 'jw-angular-social-buttons';

import {MatRippleModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { PostnewsComponent } from './postnews/postnews.component';

import { NewsCardComponent } from './template/news-card/news-card.component';

import { FirstnamePipe } from './firstname.pipe';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { DropzoneDirective } from './dropzone.directive';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SpinnerComponent } from './spinner/spinner.component';
import { CrudService } from './crud.service';

import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { SummaryPipe } from './summary.pipe';
import { OldrecordComponent } from './oldrecord/oldrecord.component';
import {WebcamModule} from 'ngx-webcam';

@NgModule({
  declarations: [
    AppComponent,
    InitplateComponent,
    LoginComponent,
    HomepageComponent,
    TopnavComponent,
    SidenavComponent,
    MainComponent,
    
    PostnewsComponent,
 
    NewsCardComponent,

    FirstnamePipe,
    DropzoneDirective,
    SpinnerComponent,
    SummaryPipe,
    OldrecordComponent,
    // InfiniteScrollModule,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({experimentalTabSynchronization:true}),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    MatCardModule,
    JwSocialButtonsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,  
    MatAutocompleteModule,
    MatProgressBarModule,
    AngularFireStorageModule,
    InfiniteScrollModule,
    WebcamModule,
    HttpModule
  ],
  providers: [
    LoginService,
    AuthService,
    TakesnapshotService,
    CrudService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
