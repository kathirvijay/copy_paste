import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {
  domain = environment.domain
  constructor(
    private http: HttpClient
  ) {

   }

   async establishConnection(tokenId: string) {
    return lastValueFrom(this.http.get<any>(this.domain + 'api/establishConnection', {
      headers: {
          Authorization: `${tokenId}`,
      }
  }))
   }
}
