import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './layouts/header/header.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProduitComponent } from './produit/produit.component';

// Déclarez et définissez vos routes
const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full' // Redirect only if the full path is empty
    },
    { 
        path: 'home', 
        component: HomeComponent,
        children: [ 
            { path: '', component: HomeComponent },
            { path: '', component: LoginComponent },
            { path: '', component: SignupComponent },
            { path: '', component: ProductDetailComponent },
            { path: '', component: ProduitComponent },
          
             // HomeComponent sera chargé lorsque vous accédez à la racine
            // Ajoutez d'autres routes enfants ici si nécessaire
        ]
        
    },
    { path: 'home', component: HomeComponent },
    { path: 'product-details/:productId', component: ProductDetailComponent },
    { path: 'products/:categoryId', component: ProduitComponent },
    { path: 'login', component: LoginComponent ,data: { noHeaderFooter: true } },
    { path: 'signup', component: SignupComponent, data: { noHeaderFooter: true } ,}
]
// Exportez les routes
export { routes };




