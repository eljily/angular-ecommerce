import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, Injector } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { BottomNavigationBarComponent } from './bottom-navigation-bar/bottom-navigation-bar.component';

import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './loading.service/loading-spinner.component';
import { scrollPageToTop } from './app.routes';
import { SearchResultsComponent } from './search/search-results.component';







@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    HeaderComponent,
    FooterComponent,
    BottomNavigationBarComponent,
    LoadingSpinnerComponent,
    


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    // Ajoutez scrollPageToTop en tant que fournisseur ici
    {
      provide: 'scrollPageToTop',
      useFactory: (router: Router) => () => scrollPageToTop(router),
      deps: [Router]
    }
  ]
})

export class AppComponent {
  title = 'angular-ecommerce';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('scrollPageToTop') private scrollPageToTop: Function
  ) {}

  getData() {
    this.http.get('http://localhost:8081').subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      // Si la navigation est réussie, on fait défiler la page vers le haut
      if (val instanceof NavigationEnd) {
        this.scrollPageToTop();
      }
    });
  }
}