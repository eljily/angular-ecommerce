import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Product } from './service/model';
import { ProductsService } from './service/products.service';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [RouterModule, NgFor ,IonicModule,CommonModule],
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {
  pagedProducts: any[] = [];
  currentPage = 1;
  rows = 30;
  totalProducts = 0;
  categoryId: number | undefined;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log("Params:", params);
      const categoryIdParam = params.get('categoryId');
     // console.log('categoryIdParam:', categoryIdParam); // Ajout de ce log pour vérifier la valeur de categoryIdParam
      if (categoryIdParam) {
        const categoryId = Number(categoryIdParam);
     //   console.log('Parsed categoryId:', categoryId); // Ajout de ce log pour vérifier la valeur de categoryId après la conversion en nombre
        if (!isNaN(categoryId)) {
          this.categoryId = categoryId;
          console.log('Assigned categoryId:', this.categoryId); // Ajout de ce log pour vérifier la valeur de categoryId après l'attribution à la propriété de classe
          this.fetchProducts(categoryId);
      //    console.log("ngOnInit executed!")
        } else {
      //    console.error('Invalid categoryId:', categoryIdParam);
        }
      } else {
    //    console.error('Missing categoryId parameter in URL');
      }
    });
  }

  fetchProducts(categoryId: number) {
    //console.log('Fetching products for categoryId:', categoryId); // Ajout de ce log pour vérifier que categoryId est utilisé dans fetchProducts
    let productsObservable: Observable<any>;

    if (categoryId === 0) {
      productsObservable = this.productService.getAllProductsPaged(this.currentPage - 1, this.rows);
    } else {
      productsObservable = this.productService.getAllProductsBySubCategoryId(categoryId, this.currentPage - 1, this.rows);
    }

    productsObservable.subscribe(
      (response: any) => {
        this.pagedProducts = response.data;
        this.totalProducts = response.meta.total;
     //   console.log("paged products:", this.pagedProducts);
      },
      error => {
      //  console.error('Error fetching products:', error);
      }
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    if (this.categoryId !== undefined) {
      this.fetchProducts(this.categoryId);
    } else {
   //   console.error('categoryId is undefined');
    }
  }
  
  redirectToAddProduct() {
    this.router.navigateByUrl('/add');
  }
}