import { CommonModule } from '@angular/common';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Product } from '../service/model/model';
import { CarouselModule } from 'primeng/carousel';
import { ProductsService } from '../service/products.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../service/auth.service';
import { FavoriteService } from '../service/favorite.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ CommonModule,CarouselModule,TranslateModule ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit {

  productId!: number;
  productDetails!: Product;
  status = false;
  isAuthenticated = false;
  isTokenAvailable: boolean = false;
  isFavorite: boolean = false;

    // Déclarez une variable pour stocker l'index de l'image principale
    currentImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductsService,
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = +params['productId'];
      this.fetchProductDetails();
      this.isTokenAvailable = this.authService.isTokenAvailable();
      this.checkIfProductIsFavorite(this.productId);
    });
  }

  changeMainImage(index: number): void {
    this.currentImageIndex = index;
  }

  fetchProductDetails() {
    this.productService.getProductDetails(this.productId).subscribe(
      (response: any) => {
        this.productDetails = response;
        console.log('Product details fetched:', response);
      },
      error => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  checkIfProductIsFavorite(productId: number): void {
    console.log('Checking if product is favorite with ID:', productId);
    if (this.isTokenAvailable) {
      this.favoriteService.checkIfProductIsFavorite(productId).subscribe(
        (response: any) => {
          console.log('Favorite service response:', response);
          this.isFavorite = response.data; // Utiliser la propriété `data` de la réponse
          console.log('isFavorite set to:', this.isFavorite); // Log to confirm state
          this.cdr.detectChanges(); // Force change detection
        },
        error => {
          console.error('Error checking if product is favorite:', error);
          if (error.status === 401) {
            console.error('User not authenticated. Redirecting to login page.');
            // Handle redirection to login page here
          }
        }
      );
    } else {
      console.error('User not authenticated. Please login to check favorites.');
    }
  }

  toggleFavorite(productId: number): void {
    console.log('Toggle favorite called for product ID:', productId);
    if (this.isTokenAvailable) {
      console.log('Token is available. Adding or removing product from favorites.');
      this.favoriteService.addOrRemoveFavorite(productId).subscribe(
        (response: any) => {
          console.log('Toggle favorite response:', response);
          this.isFavorite = !this.isFavorite;
          console.log('isFavorite toggled to:', this.isFavorite); // Log to confirm state
          this.cdr.detectChanges(); // Force change detection
        },
        error => {
          console.error('Error toggling product favorite:', error);
        }
      );
    } else {
      console.error('User not authenticated. Please login to toggle favorites.');
    }
  }

  
  calculateDateAgo(createDate: Date | undefined): string{
    if (!createDate) {
      return ''; // Si la date est undefined, retourner une chaîne vide
    }
    // Convertir la chaîne createDate en objet Date
    const createDateObj = new Date(createDate);
  
    // Obtenir la date actuelle
    const currentDate = new Date();
  
    // Calculer la différence en millisecondes entre les deux dates
    const differenceInMs = currentDate.getTime() - createDateObj.getTime();
  
    // Convertir la différence en jours
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  
    // Soustraire 3 jours de la différence pour obtenir la date il y a 3 jours
    const dateAgo = new Date(currentDate.getTime() - (3 * 24 * 60 * 60 * 1000));
  
    // Formater la date en format lisible
    const formattedDateAgo = `${dateAgo.toLocaleDateString('fr-FR')}`;
  
    return formattedDateAgo;
  }
  
}