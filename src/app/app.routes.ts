import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './layouts/header/header.component';

// Déclarez et définissez vos routes
const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent,
        children: [ 
            { path: '', component: HomeComponent },
            { path: '', component: LoginComponent },
            { path: '', component: SignupComponent },
             // HomeComponent sera chargé lorsque vous accédez à la racine
            // Ajoutez d'autres routes enfants ici si nécessaire
        ]
        
    },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
];

// Exportez les routes
export { routes };
