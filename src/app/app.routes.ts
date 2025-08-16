import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserLoginComponent } from './components/user-login/user-login.component';;
import { TransactionComponent } from './components/transaction/transaction.component';

export const routes: Routes = [
    {path: 'app-user-registration',
     component: UserRegistrationComponent,
    //  canActivate: [authGuard, adminRoleGuard]
    },
    {path: 'app-welcome', component: WelcomeComponent},
    {path: 'app-user-login', component: UserLoginComponent},
    {path: 'app-transaction', component: TransactionComponent },
    {path: '', redirectTo: 'app-user-registration', pathMatch: 'full' }
];
