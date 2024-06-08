import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environement/environement';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  checkIfProductIsFavorite(productId: number): Observable<boolean> {
    const headers = this.authService.getHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/favorites/isFavorite/${productId}`, { headers });
  }
  
  addOrRemoveFavorite(productId: number): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post(`${this.apiUrl}/favorites/${productId}`, {}, { headers });
  }
  getFavoriteProducts(): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/favorites`, { headers });
  }
  
}
