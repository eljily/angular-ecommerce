import { Routes, Router, NavigationEnd } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CategoryProductsComponent } from './category-products/category-products.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProduitComponent } from './produit/produit.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchResultsComponent } from './search/search-results.component';
import { UserProductComponent } from './user-product/user-product.component';
import { SubRegionProductsComponent } from './sub-region-products/sub-region-products.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, data: { noHeaderFooter: true } },
  { path: 'signup', component: SignupComponent, data: { noHeaderFooter: true } },
  { path: 'product-details/:productId', component: ProductDetailComponent },
  { path: 'products/:categoryId', component: ProduitComponent },
  { path: 'add-product', component: AddProductComponent, canActivate: [authGuard] },
  { path: 'user-product', component: UserProductComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'delete-account', component: DeleteAccountComponent },
  { path: 'category-products/:categoryId', component: CategoryProductsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'sub-region-products/:subRegionId', component: SubRegionProductsComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: '**', redirectTo: 'home' } // Redirect to home for any unknown paths
];

// Ajoutez l'écouteur d'événements de navigation
export function scrollPageToTop(router: Router) {
  router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0);
    }
  });
}
