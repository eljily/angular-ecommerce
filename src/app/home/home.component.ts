import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../layouts/footer/footer.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { ProduitComponent } from '../produit/produit.component';
import {ProductsService} from '../produit/service/products.service'


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,ProduitComponent ,RouterLink,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: any[] = []; // Définir une variable pour stocker les produits

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.getAllProducts(); // Appel de la méthode pour récupérer tous les produits au chargement du composant
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (response: any) => {
        this.products = response.data; // Assigner le tableau de produits à la variable products
        console.log('Products:', this.products); // Ajout d'un console.log pour vérifier les produits récupérés
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }
}
