import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  navigateToSubCategory(event: any) {
    const subCategoryId = event.target.value;
    this.router.navigateByUrl(subCategoryId);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
