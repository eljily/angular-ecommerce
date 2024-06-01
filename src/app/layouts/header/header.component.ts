import { ChangeDetectorRef, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { MenuItem } from 'primeng/api';
import { Category, SubCategory, SubCategoryResponse } from '../../service/model/Category';
import { CategoryService } from '../../service/category.service';
import { ProductsService } from '../../service/products.service';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../service/UserService';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { SharedNavigationService } from '../../bottom-navigation-bar/shared-navigation.service';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../search/search-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,MatMenuModule ,HttpClientModule,FormsModule,  NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  activeLink!: string;
  currentUser: any;
  searchResults: any[] = [];
  searchKeyword: string = '';
  currentUserSubject: BehaviorSubject<any>;
  categories: Category[] = [];
  products: any[] = [];
  selectedCategory: string = 'all';
  isLoggedIn: boolean = false;

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
    @Inject(PLATFORM_ID) private platformId: Object,
    private searchService: SearchService
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
      this.isLoggedIn = !!user; // Met à jour l'état de connexion de l'utilisateur
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/home') {
        this.selectedCategory = 'all';
      }
    });

    this.loadCategories();
    this.loadProducts();
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

  toggleSubMenu(category: Category): void {
    console.log('Before toggle:', category);
    console.log('Category:', category);
    if (category.subCategories && category.subCategories.length > 0) {
        console.log('Subcategories:', category.subCategories);
        // Supprimez la logique qui utilise isSubMenuOpen
        console.log('After toggle:', category);
    } else {
        console.log('No subcategories found.');
    }
    this.cdr.detectChanges();
}


  async loadCategories(): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories().toPromise();
      if (categories) {
        for (const category of categories) {
          const subCategories = await this.categoryService.getSubCategoriesByCategoryId(category.id).toPromise();
          const categoryWithSubCategories: Category = {
            ...category,
            subCategories: subCategories || [] // Assurez-vous que subCategories est un tableau même s'il est null
          };
          this.categories.push(categoryWithSubCategories);
        }
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
          this.searchService.updateSearchResults(response); // Transmet les résultats au service partagé
          console.log('Résultats de la recherche:', response);
          this.router.navigate(['/search-results'], { queryParams: { keyword } }); // Redirige vers la page de résultats de recherche
          this.router.navigate(['/search-results'], { queryParams: { keyword } }); // Redirige vers la page de résultats de recherche
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
