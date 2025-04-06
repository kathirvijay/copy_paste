import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { MsalLocalService } from '../msal.service'
import { AuthenticationServiceService } from '../authentication/authentication.service.service';
 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isLoggedIn: boolean = false;
  userName:string | null | undefined = null;

  constructor(
          private authService :  MsalService,
          private router: Router,
          private msalService: MsalLocalService,
          private Authentication : AuthenticationServiceService
  ) {

    this.msalService.handleRedirect()
    this.msalService.account$.subscribe(account => {
      this.isLoggedIn = !!account;
      this.establishConnection(account)
      console.log('Logged in:', this.isLoggedIn, 'Account:', account);
    });
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const account = this.authService.instance.getActiveAccount();
    console.log('check for logout ', account);
    if(account != null) {
      this.isLoggedIn = true
      this.userName = account.name
     
    } else {
      this.isLoggedIn = false
      this.userName = null
    }
  }

  async logout() {
    let result = await this.msalService.logout(true);
    console.log(result);
    // if(result.success) {
    //   this.router.navigate(['/login']);
    // } else {
    //   console.log('logout failed');
    // }
    this.checkLoginStatus();
  }

  async establishConnection(account : any) {
    console.log('acc', account);
    
    const param= {
      tokenId: account?.idToken
    }
    let result = await this.Authentication.establishConnection(param.tokenId)
    console.log('result', result);
    
    if(result.success) {
      console.log('success');
      
    } else {
      console.log("connection was extablished !!!");
      
    }
  }
}
