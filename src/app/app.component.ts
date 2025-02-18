import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  isSideNavOpen = false;

  // Toggle side navigation
  toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }
}
