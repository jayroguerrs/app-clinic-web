import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {NavBarMenu, NavBarOption} from "../models/nav-bar";
import {Observable} from "rxjs/Observable";

@Injectable({ providedIn: 'root' })
export class NavBarService {
  _NavBarMenus = new BehaviorSubject<NavBarMenu[]>([]);
  _Title = new BehaviorSubject<string | null>(null);
  _Start = new BehaviorSubject<boolean>(false);
  _Subtitle = new BehaviorSubject<string | null>(null);
  _showNavBarTop = new BehaviorSubject<boolean>(false);

  _NavBarOption = new BehaviorSubject<NavBarOption | null>(null);

    constructor(

    ) {
    }

    getShowNavBarTop(): Observable<boolean> {
      return this._showNavBarTop.asObservable();
    }

    setShowNavBarTop(value: boolean) {
      this._showNavBarTop.next(value);
    }

    setNavBarOption(options: NavBarOption) {
      this._NavBarOption.next(options);
    }
}
