import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserLoginComponent } from './components/user-login/user-login.component';;
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { FilteredComponent } from './components/show-transactions/filtered/filtered.component';
import { CategoryManageComponent } from './components/category-insert/category-manage.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminRoleGuardGuard } from './shared/guards/admin-role-guard.guard';

export const routes: Routes = [
    {path: 'app-user-registration',
     component: UserRegistrationComponent,
    //  canActivate: [authGuard, adminRoleGuard]
    },
    {path: 'app-welcome', component: WelcomeComponent},
    {path: 'app-user-login', component: UserLoginComponent},
    {path: 'app-transaction', component: TransactionComponent },
    {path: 'app-transaction-list', component: TransactionListComponent},
    {path: 'app-filtered', component: FilteredComponent},
    {path: 'app-category-manage', component: CategoryManageComponent, canActivate: [authGuard, adminRoleGuardGuard]},
    {path: '', redirectTo: 'app-user-registration', pathMatch: 'full' }
];
