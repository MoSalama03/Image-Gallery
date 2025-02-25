import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SearchEngineComponent } from "./search-engine/search-engine.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, SearchEngineComponent],
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
