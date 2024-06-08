import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  isBrowser: boolean = false;

  slides = [
    { image: '../../assets/img/pub/Bankily-1-1920X700-Vf.jpg' },
    { image: '../../assets/img/pub/unnamed.jpg' },
    { image: '../../assets/img/pub/og.jpg' },
    { image: '../../assets/img/pub/bmci-512x334.jpg' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }
  }
}
