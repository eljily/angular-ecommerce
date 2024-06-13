import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Product } from '../service/model/model';
import { CarouselModule } from 'primeng/carousel';
import { ProductsService } from '../service/products.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../service/auth.service';
import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CarouselModule, TranslateModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  productDetails!: Product;
  isTokenAvailable = false;
  isFavorite = false;
  currentImageIndex = 0;

  @ViewChild('imageModal') imageModal!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductsService,
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = +params['productId'];
      this.fetchProductDetails();
      this.isTokenAvailable = this.authService.isTokenAvailable();
      this.checkIfProductIsFavorite(this.productId);
    });
  }

  fetchProductDetails(): void {
    this.productService.getProductDetails(this.productId).subscribe(
      (response: any) => {
        this.productDetails = response;
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  checkIfProductIsFavorite(productId: number): void {
    if (this.isTokenAvailable) {
      this.favoriteService.checkIfProductIsFavorite(productId).subscribe(
        (response: any) => {
          this.isFavorite = response.data;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error checking if product is favorite:', error);
        }
      );
    }
  }

  toggleFavorite(productId: number): void {
    if (this.isTokenAvailable) {
      this.favoriteService.addOrRemoveFavorite(productId).subscribe(
        (response: any) => {
          this.isFavorite = !this.isFavorite;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error toggling product favorite:', error);
        }
      );
    }
  }

  openFullScreenGallery(): void {
    if (this.imageModal) {
      this.imageModal.nativeElement.style.display = 'block';
    }
  }

  closeFullScreenGallery(): void {
    if (this.imageModal) {
      this.imageModal.nativeElement.style.display = 'none';
    }
  }

  showImage(index: number): void {
    this.currentImageIndex = index;
    this.openFullScreenGallery();
  }

  nextImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.productDetails.images.length;
  }

  previousImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex + this.productDetails.images.length - 1) %
      this.productDetails.images.length;
  }
}
