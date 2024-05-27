import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _searchResults: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public searchResults$ = this._searchResults.asObservable();

  constructor() {}

  updateSearchResults(results: any[]): void {
    this._searchResults.next(results);
  }
}
