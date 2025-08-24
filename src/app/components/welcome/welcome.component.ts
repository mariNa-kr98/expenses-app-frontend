import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  name = computed(() => {
    const user = this.userService.user$();
    return user ? user.username : '';
  });

  constructor(private userService: UserService) {}
  
  // name: ReturnType<typeof this.userService.user$.asReadonly>;  

  // constructor(private userService: UserService) {
  //   this.name = this.userService.user$.asReadonly();
  // }
}
