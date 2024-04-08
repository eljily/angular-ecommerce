import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductsService } from '../produit/service/products.service';
import { CategoryService } from '../layouts/header/category.service';
import { CommonModule } from '@angular/common';
import { Category, SubCategory } from '../produit/service/Category';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
  providers: [MessageService],

})
export class AddProductComponent implements OnInit {
  categories: Category[] = []; // Mettez à jour le type de données ici
  subCategories: SubCategory[] = [];
  selectedCategory: string = '';
  selectedSubCategory: string = '';

  constructor(
    private productService: ProductsService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((data: Category[]) => { // Mettez à jour le type de données ici
      this.categories = data; // Assurez-vous que les données sont de type Category[]
    });
  }

  loadSubCategories() {
    console.log('Selected category:', this.selectedCategory); // Vérifiez la valeur de selectedCategory
    const categoryId = parseInt(this.selectedCategory, 10);
    console.log('Parsed category ID:', categoryId); // Vérifiez la valeur convertie en entier
    if (!isNaN(categoryId)) {
      this.categoryService.getSubCategoriesByCategoryId(categoryId).subscribe((subCategories: SubCategory[]) => {
        this.subCategories = subCategories; // Mettez à jour les sous-catégories avec la réponse
      });
    } else {
      console.error('Invalid category ID:', this.selectedCategory);
    }
  }
  
  
  onSubmit() {
    // Ajoutez ici la logique pour soumettre le formulaire
  }
}