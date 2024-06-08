import { CommonModule, NgFor, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { forkJoin, mergeMap } from 'rxjs';
import { FooterComponent } from '../layouts/footer/footer.component';
import { CategoryService } from '../service/category.service';
import { HeaderComponent } from '../layouts/header/header.component';
import { ProduitComponent } from '../produit/produit.component';
import { Category, SubCategory } from '../service/model/Category';
import { Product } from '../service/model/model';
import {ProductsService} from '../service/products.service'
import { SliderComponent } from '../slider/slider.component';
import { TranslateModule } from '@ngx-translate/core';




@Component({
  selector: 'app-home',
  standalone: true,
  
  imports: [HeaderComponent,FooterComponent,ProduitComponent ,RouterLink,CommonModule,RouterModule, NgFor ,SliderComponent,CarouselModule,TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})



export class HomeComponent implements OnInit {
  productsData: any[] = []; // Initialiser la variable pour stocker les données des produits
  categories: any[] = [];
  adGroups = [
    [
      { imageUrl: '../../assets/slider1/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg' },
    
    ],
    [
      { imageUrl: '../../assets/slider2/ecommerce-website-banner-template-presents-260nw-2252124451.webp' },
      { imageUrl: '../../assets/slider2/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg' }
    ],

  ];


  slides = [
    { image: '../../assets/slider3/ecommerce-banner.jpg' },
    { image: '../../assets/slider3/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg' },

  ];

  isDesktopView: boolean = false;
  isBrowser: boolean = false;


  constructor(private productService: ProductsService,private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: Object
) {}
ngOnInit(): void {
  this.checkScreenSize();

  this.productService.getAllWithProducts().subscribe(
    (data: any) => {
      console.log('Données récupérées data:', data);
      if (data && data.data && Array.isArray(data.data)) {
        this.productsData = data.data;
      } else {
        console.error('Les données retournées ne sont pas dans le format attendu.');
      }
    },
    (error: any) => {
      console.error('Erreur lors de la récupération des produits avec les catégories:', error);
    }
  );

  this.categoryService.getAllCategories().subscribe(
    (categories: any[]) => {
      this.categories = categories;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  );
}

// Méthode pour vérifier la taille de l'écran et définir isDesktopView en conséquence
checkScreenSize() {
  if (isPlatformBrowser(this.platformId)) {
    // Exécute le code uniquement si l'application est exécutée côté client
    this.isDesktopView = window.innerWidth >= 768;

    // Ajouter un écouteur d'événement pour vérifier la taille de l'écran lors du redimensionnement
    window.addEventListener('resize', () => {
      this.isDesktopView = window.innerWidth >= 768;
    });
  }
}




  canScrollLeft(categoryId: number): boolean {
    const container = document.querySelector(`[data-category-id="${categoryId}"]`);
    return container ? container.scrollLeft > 0 : false;
  }

  canScrollRight(categoryId: number): boolean {
    const container = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (container) {
      return container.scrollWidth > container.clientWidth && container.scrollLeft + container.clientWidth < container.scrollWidth;
    }
    return false;
  }

  scrollLeft(categoryId: number): void {
    const container = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (container) {
      container.scrollBy({
        left: -200, // Défilement de 200 pixels vers la gauche
        behavior: 'smooth'
      });
    }
  }

  scrollRight(categoryId: number): void {
    const container = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (container) {
      container.scrollBy({
        left: 200, // Défilement de 200 pixels vers la droite
        behavior: 'smooth'
      });
    }
  }
}