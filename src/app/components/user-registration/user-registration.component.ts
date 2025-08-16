
import { Component, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {
  userService = inject(UserService)

  registrationStatus: {success: boolean, message: string} = {
  success: false,
  message: 'Not attempted yet'

  }

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
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
    const data: User = {
      'username': this.form.get('username')?.value || '',
      'password': this.form.get('password')?.value || ''
    }
    console.log(data);
  this.userService.registerUser(data)
    .subscribe({
      next: (response) => {
        console.log("User saved", response);
        this.registrationStatus = {success: true, message: "User registered"}
      },
      error: (response) => {
        console.log("User not saved", response.error.data.errorResponse.errmsg)
        this.registrationStatus = {success: false, message: response.error.data.errorResponse.errmsg}
      }
    })
  }

  registerAnother(){
    this.form.reset()
    this.registrationStatus = {success:false, message: "Not attempted yet"}
  }
  
}
