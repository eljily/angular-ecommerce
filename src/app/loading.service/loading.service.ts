import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  showLoadingSpinner() {
    this.loadingSubject.next(true);
    console.log('Loading spinner shown');
  }

  hideLoadingSpinner() {
    this.loadingSubject.next(false);
    console.log('Loading spinner hidden');
  }

  hideLoadingSpinnerWithDelay(delay: number = 10000) {
    setTimeout(() => {
      this.hideLoadingSpinner();
    }, delay);
  }
}
