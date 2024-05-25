import { ChangeDetectorRef, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../auth/service/auth.service';
import { MenuItem } from 'primeng/api';
import { Category, SubCategory, SubCategoryResponse } from '../../produit/service/Category';
import { CategoryService } from './category.service';
import { ProductsService } from '../../produit/service/products.service';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../profile/UserService';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { SharedNavigationService } from '../../bottom-navigation-bar/shared-navigation.service';
import { FormsModule } from '@angular/forms';


// Interface pour représenter une catégorie avec le menu déroulant des sous-catégories
interface CategoryWithSubMenu {
  id: number;
  name: string;
  subCategories: SubCategory[];
  isSubMenuOpen: boolean;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,MatMenuModule ,HttpClientModule,FormsModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  activeLink!: string;
  currentUser: any;
  searchResults: any[] = [];
  searchKeyword: string = '';
  currentUserSubject: BehaviorSubject<any>;
  categories: CategoryWithSubMenu[] = [];
  products: any[] = [];
  selectedCategory: string = 'all';
  category: SubCategoryResponse = {
    status: null,
    message: 'Retrieved Sub categories By Category ID.',
    data: [],
    meta: null
  };

  categoryIconMappings: { [key: string]: string } = {
    'Electronics': 'pi pi-mobile',
    'Telephones': 'pi pi-mobile',
    'Computers': 'pi pi-desktop',
    'Tablets': 'pi pi-tablet',
    'Accessories': 'pi pi-clock',
    'Home': 'pi pi-home',
    'Others': 'pi pi-user'
  };



  isSmallScreen: boolean = false;
  startIndex: number = 0;
  endIndex: number = 7;
  showDropdown: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductsService,
    private sharedNavigationService: SharedNavigationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.userId) {
        this.userService.getUserById(user.userId).subscribe((userDetails: any) => {
          this.currentUser = userDetails;
        });
      }
      this.sharedNavigationService.activeLink$.subscribe(link => {
        this.activeLink = link;
      });
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/home') {
        this.selectedCategory = 'all';
      }
    });

    this.loadCategories();
    this.loadProducts();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToSubCategory(event: any): void {
    const subCategoryId = event.target.value;
    if (subCategoryId === 'all') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/products', subCategoryId]);
    }
  }

  onSubCategorySelected(event: any): void {
    const selectedSubCategoryId = event.target.value;
    console.log('Selected subcategory ID:', selectedSubCategoryId);
    this.navigateToProduct(selectedSubCategoryId);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
    this.authService.logout();
    this.currentUser = null;
    this.cdr.detectChanges();
    console.log('Utilisateur déconnecté avec succès.');
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  hideDropdown(): void {
    this.showDropdown = false;
  }

  navigateToCategory(categoryId: number) {
    this.router.navigate(['/products', categoryId]);
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/products-details', productId]);
  }

  toggleSubMenu(category: CategoryWithSubMenu): void {
    console.log('Before toggle:', category.isSubMenuOpen);
    console.log('Category:', category);
    if (category.subCategories && category.subCategories.length > 0) {
      console.log('Subcategories:', category.subCategories);
      category.isSubMenuOpen = !category.isSubMenuOpen;
    } else {
      console.log('No subcategories found.');
    }
    console.log('After toggle:', category.isSubMenuOpen);
    this.cdr.detectChanges();
  }

  async loadCategories(): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories().toPromise();
      console.log('Categories:', categories);
      if (categories) {
        for (const category of categories) {
          const subCategories = await this.categoryService.getSubCategoriesByCategoryId(category.id).toPromise();
          console.log('Subcategories for category', category.id, ':', subCategories);
          if (subCategories) {
            const categoryWithSubMenu: CategoryWithSubMenu = {
              ...category,
              isSubMenuOpen: false,
              subCategories: subCategories
            };
            this.categories.push(categoryWithSubMenu);
          } else {
            console.log('No subcategories found for category', category.id);
          }
        }
        console.log('Categories with subcategories:', this.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
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

// Méthode de recherche
onSearch(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const input = form.elements.namedItem('searchKeyword') as HTMLInputElement;
  const keyword = input.value.trim();

  if (keyword) {
    this.productService.getProductsByKeyword(keyword).subscribe(
      (response: any[]) => {
        this.products = response;
        console.log('Résultats de la recherche:', this.products);
      },
      (error: any) => {
        console.error('Erreur lors de la recherche de produits:', error);
      }
    );
  }
}




  // Méthodes pour la navigation par catégorie
  previousCategory() {
    if (this.startIndex > 0) {
      this.startIndex -= 1;
      this.endIndex -= 1;
    }
  }

  nextCategory() {
    if (this.endIndex < this.categories.length) {
      this.startIndex += 1;
      this.endIndex += 1;
    }
  }
}