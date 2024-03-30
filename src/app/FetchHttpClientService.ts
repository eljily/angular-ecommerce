import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FetchHttpClientService {
  constructor() { }

  fetch(url: string, options?: any): Promise<any> {
    return fetch(url, options);
  }
}
