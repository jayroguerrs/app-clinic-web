import { Component } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({ selector: 'app-home', templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;

    constructor(
        private accountService: AccountService
    ) {
        this.user = this.accountService.userValue;
    }
}
