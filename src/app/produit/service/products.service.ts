import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private api = "http://localhost:8081/api";

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.api}/products`);
  }

  getProductsByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${this.api}/products/productsByCategoryId/${categoryId}`);
  }

  getAllProductsPaged(page: number = 0, size: number = 11): Observable<any> {
    return this.http.get(`${this.api}/products?page=${page}&size=${size}`);
  }

  getAllProductsBySubCategoryId(categoryId: number, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.api}/products/productsBySubCategoryId/${categoryId}?page=${page}&size=${size}`);
  }

  getProductDetails(productId: number): Observable<any> {
    return this.http.get(`${this.api}/products/${productId}`);
  }

  addProduct(product: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.api}/products/addProduct`, product, { headers }).pipe(
      catchError(error => {
        console.error('Error adding product:', error);
        return throwError(error);
      })
    );
  }

  getUserProducts(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return throwError('Token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.api}/users/myProducts`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user products:', error);
        return throwError(error);
      })
    );
  }

  deleteProductById(productId:number) : Observable<any> {
    return this.http.delete(`${this.api}/products/${productId}`);
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.api}/users/${userId}`);
  }

  getAllWithProducts(): Observable<any> {
    return this.http.get(`${this.api}/categories/withProducts`);
  }

  getAllRegionsWithSubRegions(): Observable<any> {
    return this.http.get(`${this.api}/regions`);
  }

  getProductsByKeyword(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/productsByKeyword/${keyword}`);
  }

  // Nouvelle méthode pour récupérer les catégories
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.api}/categories`);
  }

  AllgetProductsByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${this.api}/products/productsByCategoryId/${categoryId}`);
  }
}