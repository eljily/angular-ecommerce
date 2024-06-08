import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: { [url: string]: any } = {};

  constructor() { }

  // Méthode pour vérifier si les données sont en cache
  public has(url: string): boolean {
    return !!this.cache[url];
  }

  // Méthode pour récupérer les données mises en cache
  public get<T>(url: string): Observable<T> {
    return of(this.cache[url]);
  }

  // Méthode pour mettre les données en cache
  public put<T>(url: string, data: T): Observable<T> {
    this.cache[url] = data;
    return of(data).pipe(
      tap(_ => console.log(`Data cached for URL: ${url}`))
    );
  }

  // Méthode pour effacer une entrée spécifique du cache
  public invalidate(url: string): void {
    delete this.cache[url];
  }

  // Méthode pour effacer toutes les données en cache
  public clear(): void {
    this.cache = {};
  }
}
