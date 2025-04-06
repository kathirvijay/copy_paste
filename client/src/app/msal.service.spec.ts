import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
=======

>>>>>>> 6fd25d8d70cb1c3a7567fc6ecb42b6e6834d5436
import { MsalService } from '@azure/msal-angular';

describe('MsalService', () => {
  let service: MsalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
