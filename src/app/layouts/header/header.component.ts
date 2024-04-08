import { ChangeDetectorRef, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  imports: [RouterLink,CommonModule,MatMenuModule ,HttpClientModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  
  currentUser: any;
  currentUserSubject: BehaviorSubject<any>;
  categories: CategoryWithSubMenu[] = [];
  products: any[] = [];
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

  showDropdown: boolean = false;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(null); // Initialize currentUserSubject
  }
 
  ngOnInit(): void {
    // Au chargement du composant, récupérez l'identifiant de l'utilisateur depuis le service AuthService
    this.authService.currentUser.subscribe(user => {
      if (user && user.userId) {
        // Si l'utilisateur est défini et que l'identifiant de l'utilisateur est disponible, récupérez les détails de l'utilisateur
        this.userService.getUserById(user.userId).subscribe((userDetails: any) => {
          this.currentUser = userDetails; // Correction ici : utilisez currentUser au lieu de user
          console.log('Détails  :', this.currentUser);
        });
      }
    });
  

  

  
  
    this.loadCategories();
    this.loadProducts();
  }


  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
    this.authService.logout(); // Utiliser la méthode logout() de votre service AuthService

    // Mettre à jour currentUser
    this.currentUser = null;
    // Détection de changement
    this.cdr.detectChanges();

    console.log('Utilisateur déconnecté avec succès.');
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
              subCategories: subCategories // Assigner les sous-catégories directement à subCategories
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
}