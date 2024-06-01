import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup ,Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../layouts/header/header.component';
import { AuthService } from '../../service/auth.service';
import { JwtDecoderService } from '../service/jwt.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  currentUser: any;
  isBrowser: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jwtDecoderService: JwtDecoderService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.isBrowser = isPlatformBrowser(this.platformId);
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
          this.showSuccessToast('Connexion réussie');

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

          const storedRedirectUrl = this.authService.getRedirectUrl();
          console.log('URL de redirection stockée:', storedRedirectUrl);
          
          if (storedRedirectUrl && storedRedirectUrl !== '/login') {
            console.log('Tentative de redirection vers l\'URL stockée:', storedRedirectUrl);
            this.router.navigate([storedRedirectUrl]).then(() => {
              console.log('Redirection réussie vers:', storedRedirectUrl);
            }).catch((err) => {
              console.error('Erreur de redirection vers l\'URL stockée:', err);
              console.log('Redirection par défaut vers la page d\'accueil');
              this.router.navigate(['/home']).catch((err) => {
                console.error('Erreur de redirection vers la page d\'accueil après échec:', err);
              });
            });
          } else {
            console.log('Redirection par défaut vers la page d\'accueil car l\'URL stockée est invalide ou "/login"');
            this.router.navigate(['/home']).then(() => {
              console.log('Redirection réussie vers la page d\'accueil');
            }).catch((err) => {
              console.error('Erreur de redirection vers la page d\'accueil:', err);
            });
          }
          
          // Réinitialisation de l'URL stockée après la redirection
          this.authService.setRedirectUrl('');
        },
        (error) => {
          console.error('Erreur de connexion', error);
          this.showErrorToast('Numéro de téléphone ou mot de passe incorrect. Veuillez réessayer.');
          if (error.status === 400 || error.status === 403) {
            this.errorMessage = 'Numéro de téléphone ou mot de passe incorrect. Veuillez réessayer.';
          } else {
            this.errorMessage = 'Numéro de téléphone ou mot de passe incorrect. Veuillez réessayer.';
          }
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }

  showSuccessToast(message: string) {
    if (this.isBrowser) {
        this.toastr.success(message, 'Succès');
    }
}

showErrorToast(message: string) {
    if (this.isBrowser) {
        this.toastr.error(message, 'Erreur');
    }
}


  storeAuthData(jwt: string, userId: number) {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('userId', userId.toString());
  }
}