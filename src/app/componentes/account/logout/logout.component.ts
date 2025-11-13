import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: 'logout.component.html',
})
export class LogoutComponent implements OnInit {
  showModal = false;
  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
    localStorage.clear();
    window.location.reload();
  }

}
