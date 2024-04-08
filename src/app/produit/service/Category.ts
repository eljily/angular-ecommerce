interface CategoryWithSubMenu extends Category {
  subCategories: SubCategory[];
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  nameAr: string;
  createDate: Date;
  updateDate: Date;
  categoryName: string; // Nom de la catégorie parente
}
  
  export interface SubCategoryResponse {
    status: any;
    message: string;
    data: SubCategory[];
    meta: any;
  }