import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../service/auth.service';
import { CategoryService } from '../service/category.service';
import { UserService } from '../service/UserService';
import { SearchService } from '../search/search-service';
import { SharedNavigationService } from './shared-navigation.service';

@Component({
  selector: 'app-bottom-navigation-bar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bottom-navigation-bar.component.html',
  styleUrl: './bottom-navigation-bar.component.css'
})
export class BottomNavigationBarComponent implements OnInit {
  categories: any[] = [];
  isMenuOpen: boolean = false;
  selectedTab: string = 'home';
  currentUser: any;
  currentUserSubject: BehaviorSubject<any>;
  activeLink: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService,
    private userService: UserService,
    private sharedNavigationService: SharedNavigationService,

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
      this.isMenuOpen = !!user; // Met à jour l'état de connexion de l'utilisateur
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/home') {
        this.selectedTab = 'all';
      }
    });

    this.loadCategories();
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


  isUserLoggedIn(): boolean {
    return !!this.authService.currentUserValue;
  }

  closeMenu(): void {
    this.isMenuOpen = false; // Fermer le menu en mettant la variable à false
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }



  async loadCategories(): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories().toPromise();
      if (categories) {
        for (const category of categories) {
          const subCategories = await this.categoryService.getSubCategoriesByCategoryId(category.id).toPromise();
          if (subCategories) {
            const categoryWithSubMenu = {
              ...category,
              isSubMenuOpen: false,
              subCategories: subCategories
            };
            this.categories.push(categoryWithSubMenu);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
}