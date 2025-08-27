import { Component, inject } from '@angular/core';
import { User } from '../../shared/models/user.modelmodel';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css'
})
export class DeleteUserComponent {

  userService = inject(UserService);
  users: User[] = [];
  currentUserUsername: string | null = null;

  ngOnInit() {

    const currentUser = this.userService.user$();
    this.currentUserUsername = currentUser?.sub ?? null;

    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe({
      next: data => this.users = data,
      error: err => console.error('Failed to fetch users:', err)
    });
  }

  deleteUser(user: User) {
    if (user.username === this.currentUserUsername) {
      alert("You cannot delete yourself.");
      return;
    }

    if (confirm(`Delete user ${user.username}?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          alert('User deleted successfully.');
          this.fetchUsers(); // Refresh list
        },
        error: err => {
          console.error('Delete failed:', err);
          alert('Delete failed: ' + err.error?.message || err.message);
        }
      });
    }
  }
}

