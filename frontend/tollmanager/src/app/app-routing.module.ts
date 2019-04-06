import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InitplateComponent } from './initplate/initplate.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthGuard } from './auth.guard';
import { MainComponent } from './main/main.component';

import { PostnewsComponent } from './postnews/postnews.component';
import { OldrecordComponent } from './oldrecord/oldrecord.component';


const routes: Routes =  [   {path: '', component: InitplateComponent},
                            {path: 'login', component: LoginComponent},
                            {path: 'u', component: HomepageComponent, canActivate:[AuthGuard], children: [
                              {path: '', component: MainComponent, canActivate: [AuthGuard]},
                          
                             
                              {path: 'postnews', component: PostnewsComponent, canActivate: [AuthGuard]},
                              
                              {path: 'history', component: OldrecordComponent, canActivate:[AuthGuard]}
                            ]}  
                        ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
