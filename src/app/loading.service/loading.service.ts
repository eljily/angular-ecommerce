import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private requestCount = 0;

  showLoadingSpinner() {
    if (this.requestCount === 0) {
      this.loadingSubject.next(true);
      console.log('Loading spinner shown');
    }
    this.requestCount++;
  }

  hideLoadingSpinner() {
    if (this.requestCount > 0) {
      this.requestCount--;
      if (this.requestCount === 0) {
        this.loadingSubject.next(false);
        console.log('Loading spinner hidden');
      }
    }
  }

  hideLoadingSpinnerWithDelay(data: any) {
    let delay = this.calculateDelayFromData(data);
    delay = Math.min(delay, 0); // Limiter le délai à 2000 millisecondes (2 secondes) au maximum
    setTimeout(() => {
      this.hideLoadingSpinner();
    }, delay);
  }

  private calculateDelayFromData(data: any): number {
    // Implémentez votre logique pour calculer le délai en fonction des données
    // Par exemple, vous pouvez inspecter les données et décider du délai en conséquence
    return 0; // Retourne un délai de 5 secondes par défaut
  }
}
