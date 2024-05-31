
export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
  imageUrl: string;
}

export interface SubCategory {
  id: number;
  name: string;
  nameAr: string;
  createDate: Date;
  updateDate: Date;
  categoryName: string; 
  isSubMenuOpen: boolean;
}
  
  export interface SubCategoryResponse {
    status: any;
    message: string;
    data: SubCategory[];
    meta: any;
  }