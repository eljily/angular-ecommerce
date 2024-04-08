
import { Image } from "./Image";

export interface Product {
    id: number;
    name: string;
    price: number;
    mark:string;
    hit:number;
    description: string;
    createDate: Date;
    updateDate: Date;
    images: Image[];
    
  }

  