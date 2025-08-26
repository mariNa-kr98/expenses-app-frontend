import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  private userService = inject(UserService);

  name = computed(() => this.userService.user$()?.username ?? '');
  
}
