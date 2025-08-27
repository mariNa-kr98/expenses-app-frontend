import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-list-group-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './list-group-menu.component.html',
  styleUrl: './list-group-menu.component.css'
})
export class ListGroupMenuComponent {

  menu = [
    {text: 'User Registration', linkName: 'app-user-registration'},
    {text: 'User Login', linkName: 'app-user-login'},
    {text: 'Transact', linkName: 'app-transaction'},
    {text: 'Edit Transaction', linkName: 'app-transaction-list'},
    {text: 'Manage Category', linkName: 'app-category-manage'},
    {text: 'Delete User', linkName: 'app-delete-user'}
  ]
}
