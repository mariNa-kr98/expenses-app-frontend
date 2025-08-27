import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserLoginComponent } from './components/user-login/user-login.component';;
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { CategoryManageComponent } from './components/category-manage/category-manage.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminRoleGuardGuard } from './shared/guards/admin-role-guard.guard';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { MonthlySummaryComponent } from './components/monthly-summary/monthly-summary.component';

export const routes: Routes = [
    {path: 'app-user-registration',
     component: UserRegistrationComponent,
    },
    {path: 'app-welcome', component: WelcomeComponent},
    {path: 'app-user-login', component: UserLoginComponent},
    {path: 'app-transaction', component: TransactionComponent, canActivate: [authGuard] },
    {path: 'app-transaction-list', component: TransactionListComponent, canActivate: [authGuard]},
    {path: 'app-monthly-summary', component: MonthlySummaryComponent, canActivate: [authGuard]},
    {path: 'app-category-manage', component: CategoryManageComponent, canActivate: [authGuard, adminRoleGuardGuard]},
    {path: 'app-delete-user', component: DeleteUserComponent, canActivate: [authGuard, adminRoleGuardGuard]},
    {path: '', redirectTo: 'app-user-registration', pathMatch: 'full' }
];
