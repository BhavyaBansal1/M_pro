import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitting = false;
  emailExists = false;
 
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
        lastName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
        email: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/)
        ]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
 
    this.signupForm.get('email')?.valueChanges.subscribe(() => {
      this.emailExists = false;
    });
  }
 
  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
 
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
 
    onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
 
    this.isSubmitting = true;
    const formData = this.signupForm.value;
 
    const payload = {
      email: formData.email,
      password: formData.password
    };
 
    this.http.post<any>('http://localhost:5251/api/Auth/register', payload).subscribe({
      next: () => {
        Swal.fire({
          title: 'Signup Successful!',
          text: 'Your account has been created successfully.',
          icon: 'success',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#2d6a4f',
         
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
 
        console.error('Error response:', error);
 
        if (error.status === 400 && error.error.message?.toLowerCase().includes('email already exists')) {
          this.emailExists = true;
          Swal.fire({
            title: 'Email Already Exists',
            text: 'The email address you entered is already registered. Please use a different email or log in.',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2d6a4f',
            customClass: {
              popup: 'small-swal-popup',
              title: 'small-swal-title',
              confirmButton: 'small-swal-button'
            }
          });
        } else {
          Swal.fire({
            title: 'Signup Failed',
            text: 'An unexpected error occurred. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2d6a4f',
            customClass: {
              popup: 'small-swal-popup'
            }
          });
        }
      }
    });
  }
 
  get email() {
    return this.signupForm.get('email');
  }
 
  get password() {
    return this.signupForm.get('password');
  }
}