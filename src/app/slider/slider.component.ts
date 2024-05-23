import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  slides = [
    { image: '../../assets/img/pub/Bankily-1-1920X700-Vf.jpg' },
    { image: '../../assets/img/pub/site-Bankily-1920x700-f.jpg' },
    { image: '../../assets/img/pub/unnamed.jpg' },
    { image: '../../assets/img/pub/og.jpg' },
    { image: '../../assets/img/pub/bmci-512x334.jpg' }
  ];
}