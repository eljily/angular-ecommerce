import { Component } from '@angular/core';
import { BottomNavigationBarComponent } from '../../bottom-navigation-bar/bottom-navigation-bar.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ BottomNavigationBarComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
