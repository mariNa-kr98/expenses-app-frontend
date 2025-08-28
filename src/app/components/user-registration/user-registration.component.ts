
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { 
  AbstractControl,
  FormControl, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.modelmodel';
import { Observable } from 'rxjs';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOption,
    MatSelectModule,
    CommonModule
],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent{
  userService = inject(UserService)
  isAdmin = signal(false);

  registrationStatus: {success: boolean, message: string} = {
  success: false,
  message: 'Not attempted yet'

  }

  adminEffect = effect(() => {
    const user = this.userService.user$();
    this.isAdmin.set(user?.roles?.includes('ROLE_ADMIN') ?? false);
  });


  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('USER')
  },
  this.passwordConfirmValidator,
  );

  passwordConfirmValidator(control: AbstractControl): {[key:string]: boolean} | null {
    const form = control as FormGroup;
    
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value

    if(password && confirmPassword && password!==confirmPassword) {
      form.get('confirmPassword')?.setErrors({passwordMismatch: true})
      return {passwordMismatch: true}
    }
    
    return null
  }

  onSubmit(){
    const data: User & {role?: string} = {
      'username': this.form.get('username')?.value || '',
      'password': this.form.get('password')?.value || ''
    }

    if (this.isAdmin()) {
      data.role = this.form.get('role')?.value || 'USER';
    }

    console.log(data);

    let registerEndpoint:  Observable<any>;

    if (this.isAdmin() && data.role === "ADMIN"){
      registerEndpoint = this.userService.registerAdmin(data as User & {role: string});
    }else{
      registerEndpoint = this.userService.registerUser(data);
    }

    registerEndpoint.subscribe({
      next: (response: any) => {
        console.log("User saved", response);
        this.registrationStatus = {success: true, message: "User registered"};
      },
      error: (response: any) => {
        console.log("User not saved", response.error.data.errorResponse.errmsg);
        this.registrationStatus = {success: false, message: response.error.data.errorResponse.errmsg};
      }
    });
  }

  registerAnother(){
    this.form.reset()
    this.registrationStatus = {success:false, message: "Not attempted yet"}
  }
  
}
