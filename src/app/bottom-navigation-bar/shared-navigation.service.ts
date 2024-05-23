// shared-navigation.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedNavigationService {
  private activeLinkSubject = new BehaviorSubject<string>(''); // Initialisez avec une chaîne vide
  activeLink$ = this.activeLinkSubject.asObservable();

  setActiveLink(link: string) {
    this.activeLinkSubject.next(link);
  }
}
