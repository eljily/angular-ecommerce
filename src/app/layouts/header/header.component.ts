import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { JqueryService } from './jquery.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private jqueryService: JqueryService) { }

  ngOnInit(): void {
    this.jqueryService.navbarAnimation();
    this.jqueryService.addActiveClass(); // Assurez-vous que cette méthode est correctement déclarée dans le service
  }
}
