import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ProductsService } from '../service/products.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-product',
  standalone: true,
  imports: [CommonModule,TranslateModule],
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

    deleteProduct(product: any): void {
      this.productService.deleteProductById(product.id).subscribe(
        () => {
          // Supprimer le produit supprimé du tableau des produits de l'utilisateur
          this.userProducts = this.userProducts.filter((item) => item.id !== product.id);
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }    