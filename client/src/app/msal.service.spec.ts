import { TestBed } from '@angular/core/testing';
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
