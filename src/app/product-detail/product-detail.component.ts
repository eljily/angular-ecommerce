import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Product } from '../produit/service/model';
import { CarouselModule } from 'primeng/carousel';
import { ProductsService } from '../produit/service/products.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [IonicModule ,CommonModule,CarouselModule ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent {
    productId!: number;
    productDetails!: Product;
    status = false;
  
    constructor(
      private route: ActivatedRoute,
      private productService: ProductsService
    ) { }
  
    ngOnInit() {
      // Get the productId from the route parameters
      this.route.params.subscribe(params => {
        this.productId = +params['productId']; // The '+' is used to convert the string to a number
        this.fetchProductDetails();
      });
    }
  
    fetchProductDetails() {
      this.productService.getProductDetails(this.productId).subscribe(
        (response: any) => {
          if (!this.productDetails) {
            this.productDetails = response;
          }
          console.log(response)
        },
        error => {
          console.error('Error fetching product details:', error);
        }
      );
    }
    addToggle() {
      this.status = !this.status;
    }
  }
  

