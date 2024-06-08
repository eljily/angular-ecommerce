import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../service/favorite.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './favoris.component.html',
  styleUrl: './favoris.component.css'
})
export class FavorisComponent implements OnInit {
  pagedProducts: any[] = [];
  currentPage = 1;
  rows = 50; 
  totalProducts = 0;
  categoryId: number | undefined;
  pages: number[] = [];
  searchResults: any[] = [];
  favoriteProducts: any[] = [];

  constructor(private favoriteService: FavoriteService) { }

  ngOnInit(): void {
    this.loadFavoriteProducts();
  }

  loadFavoriteProducts() {
    this.favoriteService.getFavoriteProducts().subscribe(
      (response: any) => {
        this.favoriteProducts = response.data; 
      },
      (error) => {
        console.error('Error fetching favorite products:', error);
      }
    );
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