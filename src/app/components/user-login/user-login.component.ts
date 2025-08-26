
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { LoggedInUser, User } from '../../shared/models/user.modelmodel';
import { UserService } from '../../shared/services/user.service';
import { jwtDecode } from 'jwt-decode'
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit{
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute)

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        const access_token = params["token"];
        if (access_token) {
          localStorage.setItem('access_token', access_token);
          const decodedTokenSubject = jwtDecode(access_token) as unknown as LoggedInUser
          console.log("OnInit", decodedTokenSubject);
          this.userService.user$.set({
            username: decodedTokenSubject.username,
            roles: decodedTokenSubject.roles
          });
          this.router.navigate(['app-transaction']);
        }
      })
  }

  onSubmit(){
    console.log(this.form.value);
    const credentials = this.form.value as User

    this.userService.loginUser(credentials).subscribe({
      next: () => {
        this.router.navigate(['app-transaction']);
      },
      error: err => {
        console.error("Loggin error", err);
      }
    });
  }

}

