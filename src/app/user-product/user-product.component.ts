import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { ProductsService } from '../produit/service/products.service';

@Component({
  selector: 'app-user-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-product.component.html',
  styleUrl: './user-product.component.css'
})
export class UserProductComponent  implements OnInit {
    userProducts: any[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;
    totalPages: number = 0;
    pages: number[] = [];
  
    constructor(private productService: ProductsService, private authService: AuthService) {}
  
    ngOnInit(): void {
      this.loadUserProducts();
    }
  
    loadUserProducts() {
      // Appel à la méthode de service pour récupérer les produits avec la pagination
      this.productService.getUserProducts().subscribe(
        (response) => {
          console.log('User products loaded:', response);
          this.userProducts = response;
        },
        (error) => {
          console.error('Erreur lors de la récupération des produits de l\'utilisateur', error);
        }
      );
    }
  
    setPage(page: number) {
      // Mise à jour de la page actuelle
      this.currentPage = page;
      // Charger les produits de l'utilisateur pour la page sélectionnée
      this.loadUserProducts();
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        // Passer à la page suivante
        this.currentPage++;
        // Charger les produits de l'utilisateur pour la page suivante
        this.loadUserProducts();
      }
    }
  
    prevPage() {
      if (this.currentPage > 1) {
        // Passer à la page précédente
        this.currentPage--;
        // Charger les produits de l'utilisateur pour la page précédente
        this.loadUserProducts();
      }
    }

    deleteAd(ad: any): void {
      if (confirm('Are you sure you want to delete this ad?')) {
        this.productService.deleteProductById(ad.id).subscribe(
          () => {
            // Supprimer l'annonce supprimée du tableau des annonces
            this.userProducts = this.userProducts.filter((item) => item.id !== ad.id);
          },
          (error) => {
            console.error('Error deleting ad:', error);
          }
        );
      }
    }
    
  }