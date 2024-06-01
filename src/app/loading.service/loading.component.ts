import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.css'],
  })
export class LoadingComponent {
  
}