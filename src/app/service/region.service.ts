import { HttpClient } from "@angular/common/http";
import { environment } from "../../environement/environement";
import { Product } from "./model/model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Region } from "./model/Region";

@Injectable({
    providedIn: 'root'
  })
  export class RegionService {
    private apiUrl = environment.apiUrl;
  
    constructor(private http: HttpClient) { }
    
    public getAllRegions(): Observable<Region[]> {
        return this.http.get<Region[]>(`${this.apiUrl}/regions`);
      }
    
  
    // Méthode pour récupérer les produits par ID de sous-région
    public getProductsBySubRegionId(subRegionId: number, page: number, size: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/products/productsBySubRegionId/${subRegionId}?page=${page}&size=${size}`);
      }
  }
  