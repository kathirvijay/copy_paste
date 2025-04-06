// src/app/services/msal.service.ts
import { Inject, Injectable } from '@angular/core';
import { PublicClientApplication, AccountInfo, EventMessage, EventType, RedirectRequest, PopupRequest, AuthenticationResult } from '@azure/msal-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import {  msalInstance } from './auth-config';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MsalLocalService {
  private msalInstance: PublicClientApplication;
  private accountSubject = new BehaviorSubject<AccountInfo  | null>(null);
  account$ = this.accountSubject.asObservable();
  private isInitialized = false;
  constructor(
    private authService :  MsalService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
  ) {   
    this.msalInstance = msalInstance;
     console.log("✅ MsalService Initialized:", this.msalInstance);
    this.init();
  }

  ngOnInit() {
    this.msalBroadcastService.msalSubject$
      .subscribe((event: EventMessage) => {
        if (event.eventType === EventType.LOGOUT_SUCCESS) {
          console.log("✅ Logout successful!");
        } else if (event.eventType === EventType.LOGOUT_FAILURE) {
          console.error("❌ Logout failed!", event);
        }
      });
  }

  async init() { 
    await this.initialize();
  }

  async initialize() {
    try {
      await this.msalInstance.initialize();
      console.log("✅ MSAL Fully Initialized");
      this.isInitialized = true;
      setTimeout(async () => {
        await this.handleRedirect();
      }, 1000);
    } catch (error) {
      console.error("Failed to initialize MSAL:", error);
    }
  }

  getAccounts() {
    return this.msalInstance.getAllAccounts();
  }
  

  async handleRedirect() {
    try {
      if (!this.isInitialized) {
        console.warn("⚠️ MSAL is not initialized yet. Waiting...");
        return;
      }
      console.log("🔹 Current URL:", window.location.href);
      const loginResponse = await this.msalInstance.handleRedirectPromise();
      console.log('in redirect', loginResponse);
      if (loginResponse?.account) {
        this.msalInstance.setActiveAccount(loginResponse.account);
        this.accountSubject.next(loginResponse.account);
        console.log('this.accountSubject', this.accountSubject);
      } 
      this.checkActiveAccount();
    } catch (error) {
      console.error('Error handling redirect:', error);
    }
  }

  checkActiveAccount() {
    let activeAccount = this.msalInstance.getActiveAccount();
    if (!activeAccount) {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        activeAccount = accounts[0];
        this.msalInstance.setActiveAccount(activeAccount);
      }
    }
    console.log('Active Account:', activeAccount);
    if (activeAccount) {
      this.accountSubject.next(activeAccount);
      console.log("✅ Active account set:", activeAccount);
    } else {
      console.warn("⚠️ No active account found. Try logging in.");
    }
  }

  async login() {
    // const loginRequest = {
    //   prompt: 'select_account',
    //   scopes: ['user.read'],
    // };
    // let result = await this.msalInstance.loginPopup(loginRequest);
    // console.log(result);

    // if (this.msalGuardConfig.authRequest) {
    //   this.authService.loginRedirect({
    //     ...this.msalGuardConfig.authRequest,
    //   } as RedirectRequest);
    // } else {
    //   this.authService.loginRedirect();
    // }
    
    // if(result) {
    //   // this.checkActiveAccount();
    //   return {success: true, responce: result}
    // } else {
    //   return {success: false , responce: result }
    // }
      this.loginPopup()
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.authService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    } else {
      this.authService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    }
  }

  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
  }

  // async logout() {
  //   console.log('Logging out...');

  //   try {
  //     const activeAccount = this.msalInstance.getActiveAccount();
  //     console.log('active', activeAccount);
      
  //     if (!activeAccount) {
  //       console.warn('No active account found. Logging out might fail.');
  //     } else {
  //         await this.msalInstance.logoutRedirect({
  //           account: activeAccount || null,
  //           postLogoutRedirectUri: 'http://localhost:4200/login'
  //         })
  //     }
  //     console.log('Logout successful');
  //   } catch (err) {
  //     console.error('Error during logout:', err);
  //   }
    
  // }


//   async logout() {
//     console.log('here');
    
//     // return new Promise<{success: boolean, isLoggedIn: boolean, userName: string | null}>((resolve, reject)=>{
//       // this.authService.logoutPopup().subscribe({
//       //   next: () => {
//       //     this.authService.instance.setActiveAccount(null); 
//       //     sessionStorage.clear();
//       //     localStorage.clear();
    
    
//       //     resolve({ success: true, isLoggedIn: false, userName: null})
//       //   },
//       //   error: (error) => {
//       //     console.error('Logout error', error);
//       //     reject({ success: false, error: error})
//       //   }
//       // });
//       // const accounts = this.authService.instance.getAllAccounts();
//       try {
//       return await this.msalInstance.logoutRedirect({
//         postLogoutRedirectUri: 'http://localhost:4200/login'
//       }).then(res=>{
//         // this.msalInstance.clearCache();
//         // this.msalInstance.setActiveAccount(null);
//         // sessionStorage.clear();
//         // localStorage.clear();
//         return {success: true};
//       }).catch(err=>{
//         console.log('errr', err);
//         return {success: false, err};
//       })

 

//     } catch (error) {
//         console.error("Logout error:", error);
//         return {success: false, error};
//     }
    
//   }
}
