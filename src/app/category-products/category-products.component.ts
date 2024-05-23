import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../produit/service/products.service';
import { Category } from '../produit/service/Category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent implements OnInit {
  categoryId!: number;
  products: any[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductsService) { }

  ngOnInit(): void {
    const categoryIdParam = this.route.snapshot.paramMap.get('categoryId');
    console.log('categoryIdParam:', categoryIdParam); // Vérifiez la valeur de categoryIdParam dans la console
    if (categoryIdParam) {
      this.categoryId = +categoryIdParam; // Convertit la chaîne en nombre
      console.log('categoryId:', this.categoryId); // Vérifiez la valeur de categoryId après la conversion
      this.AllgetProductsByCategoryId(this.categoryId);
    }
  }

  AllgetProductsByCategoryId(categoryId: number): void {
    this.productService.AllgetProductsByCategoryId(categoryId).subscribe(
      (data: any) => {
        this.products = data.data;
        console.log('Products:', this.products); // Vérifiez les produits récupérés dans la console
      },
      (error: any) => {
        console.error('Error fetching products by category:', error);
      }
    );
  }
}
