import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [],
  templateUrl: './onboard.component.html',
  styleUrl: './onboard.component.scss'
})
export class OnboardComponent {

      constructor(private router: Router) {
    
      }

  navigateToLogin() {
    this.router.navigate(['login']);
  }
}
