import { Component } from '@angular/core';
import { BottomNavigationBarComponent } from '../../bottom-navigation-bar/bottom-navigation-bar.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ BottomNavigationBarComponent,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
