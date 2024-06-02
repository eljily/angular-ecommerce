import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../service/products.service';
import { Category } from '../service/model/Category';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule,RouterModule,TranslateModule],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent implements OnInit {
  categoryId!: number;
  products: any[] = [];
  pagedProducts: any[] = [];
  currentPage: number = 1;
  productsPerPage: number = 50;
  pages: number[] = []; // Liste des pages

  constructor(private route: ActivatedRoute, private productService: ProductsService) { }

  ngOnInit(): void {
    const categoryIdParam = this.route.snapshot.paramMap.get('categoryId');
    if (categoryIdParam) {
      this.categoryId = +categoryIdParam;
      this.AllgetProductsByCategoryId(this.categoryId);
    }
  }

  AllgetProductsByCategoryId(categoryId: number): void {
    this.productService.AllgetProductsByCategoryId(categoryId).subscribe(
      (data: any) => {
        this.products = data.data;
        this.pages = Array(Math.ceil(this.products.length / this.productsPerPage)).fill(0).map((_, i) => i + 1);
        this.setPage(1); // Initialiser à la première page
      },
      (error: any) => {
        console.error('Error fetching products by category:', error);
      }
    );
  }

  setPage(page: number): void {
    if (page < 1 || page > this.pages.length) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.pagedProducts = this.products.slice(startIndex, endIndex);
  }

  shortenProductName(name: string): string {
    const maxLength = 16;
    if (name.length > maxLength) {
      return name.substr(0, maxLength) + '...';
    }
    return name;
  }
}