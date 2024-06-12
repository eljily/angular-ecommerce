import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Observable } from 'rxjs';
import { SearchService } from '../search/search-service';
import { Product } from '../service/model/model';
import { ProductsService } from '../service/products.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [RouterModule, NgFor ,CommonModule,TranslateModule],
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {
  pagedProducts: any[] = [];
  currentPage = 1;
  rows = 50;
  totalProducts = 0;
  categoryId: number | undefined;
  pages: number[] = [];
  searchResults: any[] = [];

  constructor(
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    console.log('ngOnInit called');

    // Récupérer l'état de la pagination de la session si disponible
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) {
      this.currentPage = Number(savedPage);
      console.log(`Restored page from session: ${this.currentPage}`);
    }

    this.route.paramMap.subscribe(params => {
      const categoryIdParam = params.get('categoryId');
      console.log(`Category ID from route: ${categoryIdParam}`);
      if (categoryIdParam) {
        const categoryId = Number(categoryIdParam);
        if (!isNaN(categoryId)) {
          this.categoryId = categoryId;
          console.log(`Fetching products for category ID: ${categoryId}`);
          this.fetchProducts(categoryId);
        }
      } else {
        console.log('No category ID, fetching all products');
        this.fetchProducts(0);
      }
    });

    // Abonnez-vous aux résultats de recherche
    this.searchService.searchResults$.subscribe((results: any[]) => {
      console.log('Search results received', results);
      if (results && results.length > 0) { // Vérifiez si les résultats de recherche ne sont pas vides
        this.pagedProducts = results;
        this.totalProducts = results.length; // Mettez à jour le total des produits avec la longueur des résultats
        this.calculatePages(); // Recalculez les pages en fonction du nouveau total des produits
      } else {
        console.log('Empty search results. No need to calculate pages.');
      }
    });
  }

  fetchProducts(categoryId: number) {
    console.log(`fetchProducts called with categoryId: ${categoryId}`);
    let productsObservable: Observable<any>;

    if (categoryId === 0) {
      productsObservable = this.productService.getAllProductsPaged(this.currentPage - 1, this.rows);
    } else {
      productsObservable = this.productService.getAllProductsBySubCategoryId(categoryId, this.currentPage - 1, this.rows);
    }

    productsObservable.subscribe(
      (response: any) => {
        console.log('Products fetched', response);
        this.pagedProducts = response.data;
        this.totalProducts = response.meta.total;
        this.calculatePages();
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  calculatePages() {
    const totalPages = Math.ceil(this.totalProducts / this.rows);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    console.log('Calculated pages:', this.pages);
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    console.log(`Page changed to: ${this.currentPage}`);
    sessionStorage.setItem('currentPage', this.currentPage.toString());
    if (this.categoryId !== undefined) {
      this.fetchProducts(this.categoryId);
    } else {
      this.fetchProducts(0);
    }
  }

  shortenProductName(name: string): string {
    const maxLength = 16;
    if (name.length > maxLength) {
      return name.substr(0, maxLength) + '...';
    }
    return name;
  }

  setPage(page: number): void {
    if (page < 1 || page > this.pages.length) return;
    this.currentPage = page;
    console.log(`Setting page to: ${this.currentPage}`);
    sessionStorage.setItem('currentPage', this.currentPage.toString());
    if (this.categoryId !== undefined) {
      this.fetchProducts(this.categoryId);
    } else {
      this.fetchProducts(0);
    }
  }
}