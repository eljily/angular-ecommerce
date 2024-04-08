import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category, SubCategory } from '../../produit/service/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getCategoryId() {
    throw new Error('Method not implemented.');
  }

    private api = "http://localhost:8081/api";
  
    constructor(private http: HttpClient) { }
  
  // Méthode pour récupérer toutes les catégories
  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  // Méthode pour récupérer les sous-catégories par ID de catégorie
  public getSubCategoriesByCategoryId(categoryId: number): Observable<SubCategory[]> {
    // Utilisez l'ID de la catégorie pour récupérer les sous-catégories associées
    return this.http.get<Category>(`${this.api}/categories/${categoryId}`).pipe(
      map((category: Category) => category.subCategories)
    );
  }
}
