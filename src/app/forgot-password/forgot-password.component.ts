import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})

export class ForgotPasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isBrowser: boolean;
  currentPassword: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      retypedPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Vous n'avez pas besoin de réinitialiser changePasswordForm ici, car il est déjà initialisé dans le constructeur
  }


  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }
  
    const { currentPassword, newPassword, retypedPassword } = this.changePasswordForm.value;

    // Mise à jour de la propriété currentPassword avec le mot de passe actuel saisi dans le formulaire
    this.currentPassword = currentPassword;

    if (currentPassword !== this.currentPassword) {
      this.errorMessage = 'Mot de passe actuel incorrect.';
      return;
    }
  
    if (newPassword !== retypedPassword) {
      this.errorMessage = 'Les nouveaux mots de passe ne correspondent pas.';
      return;
    }
  
    // Appel de la méthode changePassword pour effectuer le changement de mot de passe
    this.authService.changePassword(currentPassword, newPassword, retypedPassword).subscribe(
      response => {
        this.showSuccessToast();
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Erreur lors du changement de mot de passe', error);
        this.errorMessage = error;
        this.showErrorToast();
      }
    );
  }

  showSuccessToast() {
    if (this.isBrowser) {
      this.toastr.success('Mot de passe changé avec succès', 'Succès');
    }
  }

  showErrorToast() {
    if (this.isBrowser) {
      this.toastr.error('Erreur lors du changement de mot de passe', 'Erreur');
    }
  }
}