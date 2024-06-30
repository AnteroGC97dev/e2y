import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sideBarOpen: boolean = false;
  toggleSidebar() {
    this.sideBarOpen = this.sideBarOpen ? false : true;
  }
  title = 'HarryPotter';
}
