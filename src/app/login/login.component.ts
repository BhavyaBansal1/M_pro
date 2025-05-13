import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
 
@Component({
 selector: 'app-login',
 standalone: true,
 templateUrl: './login.component.html',
 styleUrls: ['./login.component.css'],
 imports: [CommonModule, FormsModule, RouterModule, HttpClientModule]
})
export class LoginComponent {
 email: string = '';
 password: string = '';
 loginForm: FormGroup;
 showPassword: boolean = false;
 
 constructor(
  private router: Router,
  private authService: AuthService,
  private fb: FormBuilder,
  private http: HttpClient
) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/)]],
    password: ['', [Validators.required,
      Validators.minLength(8),
     ]]
  });
}
togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

navigateToSignup(): void {
  this.router.navigate(['/signup']);
}
 onSubmit() {
  if (this.email.trim() && this.password.trim()) {
   this.authService.login(this.email, this.password).subscribe(users => {
    if (users.length > 0) {
      this.showLoginSuccessPopup();
    } else {
      this.showLoginSuccessPopup();
      // this.router.navigate(['/landing']);
    }
   }, error => {
    this.showLoginFailedPopup();
    // alert('Server error. Please try again later.');
   });
  } else {
  //  alert('Please enter both email and password.');
  this.showLoginFailedPopup();
  }
 }
 
 
private showLoginFailedPopup(): void {
  Swal.fire({
    title: 'Login Failed',
    text: 'Invalid email or password. Please try again.',
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#2d6a4f',
    customClass: {
      popup: 'small-swal-popup',
      title: 'small-swal-title',
      confirmButton: 'small-swal-button'
    }
  });
}
private showLoginSuccessPopup(): void {
  Swal.fire({
    title: 'Login Successful!',
    text: 'Welcome back!',
    icon: 'success',
    confirmButtonText: 'Go to Landing Page',
    confirmButtonColor: '#2d6a4f',
    customClass: {
      popup: 'small-swal-popup',
      title: 'small-swal-title',
      confirmButton: 'small-swal-button',
     
    }
  }).then(() => {
    this.router.navigate(['/landing']);
  });
}
}