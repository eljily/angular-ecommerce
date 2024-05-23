import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../produit/service/model';
 // Assurez-vous d'importer votre modèle de produit

@Pipe({
  name: 'filterByCategoryAndSubCategory'
})
export class FilterByCategoryAndSubCategoryPipe implements PipeTransform {
  transform(products: Product[], categoryId: number, subCategoryId: number): Product[] {
    if (!products || !categoryId || !subCategoryId) {
      return products;
    }

    return products.filter(product =>
      product.categoryId === categoryId && product.categoryId === subCategoryId
    );
  }
}
