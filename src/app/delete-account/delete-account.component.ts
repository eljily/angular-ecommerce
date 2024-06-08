import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environement/environement';
import { AuthService } from '../service/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})


export class DeleteAccountComponent {
  private apiUrl = environment.apiUrl;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  

  confirmDeleteAccount(): void {
    const deleteUrl = `${this.apiUrl}/users/deleteAccount`; // Utilisation de l'URL complète
    const token = this.authService.getToken(); // Récupérer le token d'authentification

    if (!token) {
      this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(deleteUrl, { headers }).subscribe(
      () => {
        this.authService.logout(); // Déconnexion après suppression
        this.router.navigate(['/']); // Rediriger vers la page d'accueil
        this.showSuccessToast('Votre compte a été supprimé avec succès.');
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la suppression du compte :', error);
        this.errorMessage = 'Une erreur s\'est produite lors de la suppression du compte. Veuillez réessayer.';
      }
    );
  }

  private showSuccessToast(message: string): void {
    if (isPlatformBrowser(this.platformId)) {
        this.toastr.success(message, 'Suppression réussie');
    }
  }
}