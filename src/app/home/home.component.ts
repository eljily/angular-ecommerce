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
import { ApiResponse, Product } from '../service/model/model';
import {ProductsService} from '../service/products.service'
import { SliderComponent } from '../slider/slider.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-home',
  standalone: true,
  
  imports: [HeaderComponent,FooterComponent,ProduitComponent ,RouterLink,CommonModule,RouterModule, NgFor ,SliderComponent,CarouselModule,TranslateModule,NgbModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})



export class HomeComponent implements OnInit {
  productsData: any[] = [];
  categories: any[] = [];
  groupedCategories: any[][] = [];
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

  constructor(private categoryService: CategoryService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadCategoriesWithProducts();
  }

  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktopView = window.innerWidth >= 768;
      window.addEventListener('resize', () => {
        this.isDesktopView = window.innerWidth >= 768;
        this.groupCategories(); // Regrouper les catégories à nouveau en fonction de la nouvelle taille de l'écran
      });
    }
  }

  loadCategoriesWithProducts() {
    this.categoryService.getAllWithProducts().subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.categories = response.data;
          this.groupCategories();
        } else {
          console.error('Les données retournées pour les produits ne sont pas dans le format attendu.');
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits avec les catégories:', error);
      }
    );
  }

  groupCategories() {
    const groupSize = this.isDesktopView ? 8 : 4;
    this.groupedCategories = []; // Réinitialiser les groupes
    for (let i = 0; i < this.categories.length; i += groupSize) {
      this.groupedCategories.push(this.categories.slice(i, i + groupSize));
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
        left: -200,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(categoryId: number): void {
    const container = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (container) {
      container.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  }

  shortenProductName(name: string): string {
    const maxLength = 16;
    return name.length > maxLength ? name.substr(0, maxLength) + '...' : name;
  }
}