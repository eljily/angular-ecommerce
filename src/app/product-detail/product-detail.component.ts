import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../service/model/model';
import { CarouselModule } from 'primeng/carousel';
import { ProductsService } from '../service/products.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


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

    // Déclarez une variable pour stocker l'index de l'image principale
    currentImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }

  ngOnInit() {
    // Get the productId from the route parameters
    this.route.params.subscribe(params => {
      this.productId = +params['productId']; // The '+' is used to convert the string to a number
      this.fetchProductDetails();
    });
  }

  changeMainImage(index: number): void {
    this.currentImageIndex = index;
  }

  fetchProductDetails() {
    this.productService.getProductDetails(this.productId).subscribe(
      (response: any) => {
        this.productDetails = response;
        console.log(response);
      },
      error => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  addToggle() {
    this.status = !this.status;
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