import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../layouts/header/header.component';
import { AuthService } from '../service/auth.service';
import { JwtDecoderService } from '../service/jwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jwtDecoderService: JwtDecoderService
  ) {
    this.loginForm = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulaire valide. Tentative de connexion...');
  
      const loginData = {
        phoneNumber: this.loginForm.value.phoneNumber,
        password: this.loginForm.value.password
      };
  
      this.authService.login(loginData).subscribe(
        (response) => {
          console.log('Connexion réussie', response);
  
          // Stockage du jeton JWT et de l'ID de l'utilisateur
          if (isPlatformBrowser(this.platformId)) {
            console.log('Enregistrement des informations d\'authentification dans le local storage...');
            this.storeAuthData(response.jwt, response.userId);
          }
  
          // Déchiffrer le JWT pour obtenir les informations de l'utilisateur
          const decodedToken = this.jwtDecoderService.decodeToken(response.jwt);
          console.log('Informations décodées du JWT:', decodedToken);
  
          // Afficher le nom de l'utilisateur dans la console
          const userName = decodedToken.name;
          console.log('Nom de l\'utilisateur:', userName);
  
          // Redirection vers la page d'accueil
          console.log('Redirection vers la page d\'accueil...');
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Erreur de connexion', error);
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
          } else {
            this.errorMessage = 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.';
          }
        }
      );
    } else {
      console.log('Formulaire invalide. Veuillez corriger les erreurs.');
    }
  }
  storeAuthData(jwt: string, userId: number) {
    throw new Error('Method not implemented.');
  }
  platformId(platformId: any) {
    throw new Error('Method not implemented.');
  }
}