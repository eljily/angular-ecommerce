import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { forkJoin, mergeMap } from 'rxjs';
import { FooterComponent } from '../layouts/footer/footer.component';
import { CategoryService } from '../layouts/header/category.service';
import { HeaderComponent } from '../layouts/header/header.component';
import { ProduitComponent } from '../produit/produit.component';
import { Category, SubCategory } from '../produit/service/Category';
import { Product } from '../produit/service/model';
import {ProductsService} from '../produit/service/products.service'
import { SliderComponent } from '../slider/slider.component';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,ProduitComponent ,RouterLink,CommonModule,IonicModule,RouterModule, NgFor ,SliderComponent,CarouselModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})



export class HomeComponent implements OnInit {
  productsData: any[] = []; // Initialiser la variable pour stocker les données des produits
  categories: any[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productService.getAllWithProducts().subscribe(
      (data: any) => {
        console.log('Données récupérées:', data);

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

    this.productService.getAllCategories().subscribe(
      (categories: any[]) => {
        this.categories = categories;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    );
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