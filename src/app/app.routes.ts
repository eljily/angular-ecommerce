
import { Routes } from '@angular/router';
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
import { UserProductComponent } from './user-product/user-product.component';

const routes: Routes = [
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
  { path: '**', redirectTo: 'home' } // Redirect to home for any unknown paths
];

export { routes };

