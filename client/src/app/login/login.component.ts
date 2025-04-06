import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { MsalLocalService } from '../msal.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoggedIn: boolean = false;
  userName: string | null | undefined = null;

  
    constructor(
      private router: Router,
      private authService: MsalService,
      private msalLoc: MsalLocalService
    ) {
      console.log('in login constructor');
      
      this.checkLoginStatus();
    }

    async ngOnInit() {

    }

    checkLoginStatus() {
      const account = this.authService.instance.getActiveAccount();
      console.log('account', account);
      
      if (account) {
        this.isLoggedIn = true;
        this.userName = account.name;
        this.router.navigate(['home']);
      }
    }

    async signInWithMicrosoft() {
      console.log('in ms login');
      // this.authService.loginPopup().subscribe((response: AuthenticationResult) => {
      //   this.authService.instance.setActiveAccount(response.account);
      //   if(response.account) {
      //     this.router.navigate(['home']);
      //   }
      //   this.checkLoginStatus();
      // });
      let res= await this.msalLoc.login()
      console.log('login', res);
      // if(res.success) {
      //   this.router.navigate(['home']);
      // } else {
      //   console.log("error in login !!!");
        
      // }
      // setTimeout(() => {
      //   this.checkLoginStatus();
      // }, 1000);
      
    }
  
    async signInWithGoogle() {
      console.log('logout from ms');
      // this.authService.logoutPopup();
      this.msalLoc.logout()
      this.isLoggedIn = false;
      this.userName = null;
      setTimeout(() => {
        this.checkLoginStatus();
      }, 1000);

    }
  
    navigateToLogin() {
      this.router.navigate(['login']);
    }
  

    navigateToHome() {
      this.router.navigate(['home']);
    }
}
