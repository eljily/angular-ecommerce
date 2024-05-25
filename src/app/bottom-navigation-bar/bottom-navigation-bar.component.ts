import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-bottom-navigation-bar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './bottom-navigation-bar.component.html',
  styleUrl: './bottom-navigation-bar.component.css'
})
export class BottomNavigationBarComponent {
  categories: any[] = []; 
  constructor(private router: Router,private authService: AuthService) {}
  isMenuOpen: boolean = false;


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  closeMenu(): void {
    this.isMenuOpen = false; // Fermer le menu en mettant la variable à false
  }


  navigateToSubCategory(event: any) {
    const subCategoryId = event.target.value;
    this.router.navigateByUrl(subCategoryId);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }



}
