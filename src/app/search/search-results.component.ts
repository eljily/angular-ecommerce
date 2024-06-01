import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from '../service/products.service';
import { SearchService } from './search-service';


@Component({
  selector: 'app-search-results',
  standalone: true,
  templateUrl: './search-results.component.html',
  imports: [FormsModule ,CommonModule,RouterLink,RouterModule],
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchKeyword: string = '';
  searchResults: any[] = [];

  currentPage = 1;
  rows = 50;
  totalProducts = 0;
  pages: number[] = [];

  constructor(
      private route: ActivatedRoute,
      private productService: ProductsService,
      private searchService: SearchService
  ) {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
          this.searchKeyword = params['keyword'] || '';
          if (this.searchKeyword) {
              this.productService.getProductsByKeyword(this.searchKeyword).subscribe(
                  (response: any) => {
                      this.searchResults = response.data; // Mise à jour des résultats de recherche
                      this.totalProducts = response.meta.total;
                      this.calculatePages();
                  },
                  (error: any) => {
                      console.error('Erreur lors de la recherche de produits:', error);
                  }
              );
          }
      });
  }

  calculatePages() {
      const totalPages = Math.ceil(this.totalProducts / this.rows);
      this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onPageChange(event: any) {
      this.currentPage = event.page + 1;
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
  }
}
