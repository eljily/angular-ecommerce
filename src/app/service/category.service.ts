import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Category, SubCategory } from './model/Category';
import { environment } from '../../environement/environement';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getCategoryId() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = environment.apiUrl;
  


  constructor(private http: HttpClient, private cacheService: CacheService) { } // Injectez le service de mise en cache

  public getAllCategories(): Observable<any> {
    const url = `${this.apiUrl}/categories`; // URL de l'API
    if (this.cacheService.has(url)) {
      return this.cacheService.get(url); // Récupérer les données mises en cache si elles existent
    } else {
      return this.http.get<any>(url).pipe(
        tap(data => this.cacheService.put(url, data)) // Mettre les données en cache
      );
    }
  }

  // Méthode pour récupérer les sous-catégories par ID de catégorie
  public getSubCategoriesByCategoryId(categoryId: number): Observable<SubCategory[]> {
    const url = `${this.apiUrl}/categories/${categoryId}`; // URL de l'API
    if (this.cacheService.has(url)) {
      return this.cacheService.get(url); // Récupérer les données mises en cache si elles existent
    } else {
      return this.http.get<Category>(url).pipe(
        map((category: Category) => category.subCategories),
        tap(subCategories => this.cacheService.put(url, subCategories)) // Mettre les données en cache
      );
    }
  }
}
