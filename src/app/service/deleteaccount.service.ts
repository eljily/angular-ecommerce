import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environement/environement";

export class DeleteAccountComponent {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private authService: AuthService) { }
  
    deleteAccount(): void {
      const deleteUrl = `${this.apiUrl}/users/deleteAccount`; // Utilisation de l'URL complète
      this.http.delete(deleteUrl).subscribe(
        () => {
          alert('Votre compte a été supprimé avec succès.');
          // Redirigez l'utilisateur vers la page d'accueil ou une autre page appropriée.
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la suppression du compte :', error);
          alert('Une erreur s\'est produite lors de la suppression du compte. Veuillez réessayer.');
        }
      );
    }
}
