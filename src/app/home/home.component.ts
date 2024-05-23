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
import { LoadingComponent } from '../loading.service/loading.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,ProduitComponent ,RouterLink,CommonModule,IonicModule,RouterModule, NgFor ,SliderComponent,CarouselModule,LoadingComponent],
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
        // Vérifier si les données sont correctement récupérées
        console.log('Données récupérées:', data);

        // Assurez-vous que les données sont dans la bonne structure
        if (data && data.data && Array.isArray(data.data)) {
          this.productsData = data.data;
        } else {
          console.error('Les données retournées ne sont pas dans le format attendu.');
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits avec les catégories:', error);
        // Vous pouvez également afficher un message d'erreur à l'utilisateur si nécessaire
      }
    );

    // Récupération des catégories
    this.productService.getAllCategories().subscribe(
      (categories: any[]) => {
        this.categories = categories;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des catégories:', error);
        // Vous pouvez également afficher un message d'erreur à l'utilisateur si nécessaire
      }
    );
  }
}