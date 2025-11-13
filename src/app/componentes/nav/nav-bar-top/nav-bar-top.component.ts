import { Component, OnInit } from '@angular/core';
import {NavBarMenu, NavBarOption} from "../../../shared/models/nav-bar";
import {NavBarService} from "../../../shared/services/nav-bar.service";

@Component({
  selector: 'app-nav-bar-top',
  templateUrl: './nav-bar-top.component.html',
  styleUrls: ['./nav-bar-top.component.scss']
})

export class NavBarTopComponent implements OnInit {

  start: boolean;
  menu: NavBarMenu[] = [];
  title: string;
  subtitle: string;

  navbarOption: NavBarOption;

  constructor(
    private navBarService: NavBarService
  ) { }

  ngOnInit(): void {
    this.navBarService._NavBarOption.subscribe((res: NavBarOption) => {
      this.navbarOption = res;
    });
  }

  checkType(item: any): any{
    // console.log(typeof item);
    return typeof item;
  }

}
