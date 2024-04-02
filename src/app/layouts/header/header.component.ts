import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { JqueryService } from './jquery.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/service/auth.service';
import { MenuItem } from 'primeng/api';
import { Category } from '../../produit/service/Category';
import { CategoryService } from './category.service';
import { ProductsService } from '../../produit/service/products.service';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {

  currentUser: any;
  categories: any[] = [];
  products: any[] = [];
  categoryIconMappings: { [key: string]: string } = {
    'Electronics': 'pi pi-mobile',
    'Telephones': 'pi pi-mobile',
    'Computers': 'pi pi-desktop',
    'Tablets': 'pi pi-tablet',
    'Accessories': 'pi pi-clock',
    'Home': 'pi pi-home',
    'Others': 'pi pi-user'
  };


  showDropdown: boolean = false;

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private productService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    this.loadCategories();
    this.loadProducts();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  hideDropdown(): void {
    this.showDropdown = false;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToCategory(categoryId: number) {
    this.router.navigate(['/products', categoryId]);
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/products-details', productId]);
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (response: any[]) => {
        this.categories = response;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (response: any[]) => {
        this.products = response;
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }
}
