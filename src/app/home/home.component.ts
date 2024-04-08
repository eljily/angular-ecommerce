import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { forkJoin, mergeMap } from 'rxjs';
import { FooterComponent } from '../layouts/footer/footer.component';
import { CategoryService } from '../layouts/header/category.service';
import { HeaderComponent } from '../layouts/header/header.component';
import { ProduitComponent } from '../produit/produit.component';
import { Category, SubCategory } from '../produit/service/Category';
import { Product } from '../produit/service/model';
import {ProductsService} from '../produit/service/products.service'


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,ProduitComponent ,RouterLink,CommonModule,IonicModule,RouterModule, NgFor ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit {
  categories: Category[] = []; // Initialiser la liste de catégories
  products: Product[] = []; // Initialiser la liste de produits

  constructor(
    private categoryService: CategoryService,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    // Récupérer toutes les catégories
    this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories; // Assigner les catégories récupérées à la variable categories
        console.log('Categories:', this.categories); // Vérifier les catégories récupérées
        // Pour chaque catégorie, récupérer les sous-catégories et les produits associés
        this.categories.forEach(category => {
          this.categoryService.getSubCategoriesByCategoryId(category.id).subscribe(
            (subCategories: SubCategory[]) => {
              console.log('Subcategories for category', category.name, ':', subCategories); // Vérifier les sous-catégories récupérées
              // Pour chaque sous-catégorie, récupérer les produits associés
              subCategories.forEach(subCategory => {
                this.productService.getProductsByCategoryId(subCategory.id).subscribe(
                  (response: any) => {
                    const productsData = response.data; // Accéder aux données des produits dans la réponse
                    console.log('Products for subcategory', subCategory.name, ':', productsData); // Vérifier les produits récupérés
                    // Ajouter les produits récupérés à la liste de produits
                    this.products = this.products.concat(productsData);
                    console.log('Updated products:', this.products); // Vérifier la liste de produits mise à jour
                    console.log('Product names:', this.products.map(product => product.name)); // Vérifier les noms des produits
                  },
                  (error: any) => {
                    console.error('Error fetching products for subcategory', subCategory.name, ':', error);
                  }
                );
              });
            },
            (error: any) => {
              console.error('Error fetching subcategories for category', category.name, ':', error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
}
