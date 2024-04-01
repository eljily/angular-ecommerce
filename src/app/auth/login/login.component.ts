import { Component } from '@angular/core';
import { FormBuilder, FormGroup ,Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../layouts/header/header.component';
import { AuthService } from '../service/auth.service';import { AuthRequestDto } from '../service/models';
;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; // Ajoutez cette variable pour stocker le message d'erreur

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router // Injectez le service Router
  ) {
    this.loginForm = this.formBuilder.group({
      phoneNumber: ['', Validators.required], // Changer email en phoneNumber
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: AuthRequestDto = {
        phoneNumber: this.loginForm.value.phoneNumber,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe(
        (response) => {
          // Traitement de la réponse de connexion réussie
          console.log('Connexion réussie', response);
          // Stockez les informations d'authentification
          this.authService.storeAuthData(response.jwt, response.userId);
          // Redirection vers la page d'accueil
          this.router.navigate(['/home']);
        },
        (error) => {
          // Traitement de l'erreur de connexion
          console.error('Erreur de connexion', error);
          if (error.status === 401 || error.status === 403) {
            // Le serveur a renvoyé une erreur d'authentification
            this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
          } else {
            // Une autre erreur s'est produite
            this.errorMessage = 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.';
          }
        }
      );
    }
  }
}