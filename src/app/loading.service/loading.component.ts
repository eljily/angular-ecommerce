import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from './loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  loading$ = this.loadingService.loading$;
  hasData$: Observable<boolean> = this.loadingService.hasData$;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
      const dataAvailable = false; // Changez cela pour true si les données sont disponibles
      this.loadingService.setDataAvailable(dataAvailable);
      console.log('Données disponibles:', dataAvailable);
    }, 10000);
  }
}