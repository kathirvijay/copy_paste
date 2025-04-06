import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OnboardComponent } from './onboard/onboard.component';
import { HomeComponent } from './home/home.component';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';

export const routes: Routes = [
    {path:'', redirectTo:'/login', pathMatch:'full'},
    { path: 'auth', component: MsalRedirectComponent }, 
    { path: 'logout', redirectTo:'/login', pathMatch:'full' },
    {path:'login', component: LoginComponent},
    {path:'onboard', component: OnboardComponent},
    {path:'home', component: HomeComponent, canActivate: [MsalGuard]},
    {path:'**', component: OnboardComponent}
];


export const routingProviders = [
    provideRouter(routes, withComponentInputBinding())
  ];