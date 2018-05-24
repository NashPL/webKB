import {
  BrowserModule
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  NgModule
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  AppComponent
} from './app.component';
import {
  HttpClientModule
} from '@angular/common/http';
import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule
} from '@angular/material';


import {} from '@angular/material';
import {
  NavComponent
} from './nav/nav.component';
import {
  SigninComponent
} from './signin/signin.component';

import {
  ServiceClassAuth
} from './service/service-class-auth';
import {
  ServiceClassDatasharing
} from './service/service-class-datasharing';

import {
  IndexComponent
} from './index/index.component';
import {
  DashboardComponent
} from './dashboard/dashboard.component';

const appRoutes: Routes = [{
  path: '',
  component: IndexComponent
}, {
  path: 'dashboard',
  component: DashboardComponent
}];


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SigninComponent,
    IndexComponent,
    DashboardComponent
  ],
  entryComponents: [
    SigninComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [ServiceClassAuth, ServiceClassDatasharing],
  bootstrap: [AppComponent]
})
export class AppModule {}
