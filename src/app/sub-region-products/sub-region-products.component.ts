import { Component, OnInit } from '@angular/core';
import { Product } from '../service/model/model';
import { RegionService } from '../service/region.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../search/search-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sub-region-products',
  standalone: true,
  imports: [RouterLink,CommonModule,TranslateModule],
  templateUrl: './sub-region-products.component.html',
  styleUrl: './sub-region-products.component.css'
})
export class SubRegionProductsComponent implements OnInit {
  pagedProducts: Product[] = [];
  currentPage = 1;
  rows = 50;
  totalProducts = 0;
  subRegionId: number | undefined;
  pages: number[] = [];
  searchResults: any[] = [];

  constructor(
    private regionService: RegionService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const subRegionIdParam = params.get('subRegionId');
      if (subRegionIdParam) {
        const subRegionId = Number(subRegionIdParam);
        if (!isNaN(subRegionId)) {
          this.subRegionId = subRegionId;
          this.fetchProducts(subRegionId);
        }
      }
    });

    // Abonnez-vous aux résultats de recherche
    this.searchService.searchResults$.subscribe((results: any[]) => {
      this.pagedProducts = results;
      this.totalProducts = results.length; // Mettez à jour le total des produits avec la longueur des résultats
      this.calculatePages(); // Recalculez les pages en fonction du nouveau total des produits
    });
  }

  fetchProducts(subRegionId: number) {
    this.regionService.getProductsBySubRegionId(subRegionId, this.currentPage - 1, this.rows).subscribe(
      (response: any) => {
        this.pagedProducts = response.data;
        this.totalProducts = response.meta.total;
        this.calculatePages();
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  calculatePages() {
    const totalPages = Math.ceil(this.totalProducts / this.rows);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    if (this.subRegionId !== undefined) {
      this.fetchProducts(this.subRegionId);
    }
  }

  shortenProductName(name: string): string {
    const maxLength = 16;
    if (name.length > maxLength) {
      return name.substr(0, maxLength) + '...';
    }
    return name;
  }

  setPage(page: number): void {
    if (page < 1 || page > this.pages.length) return;
    this.currentPage = page;
    this.fetchProducts(this.subRegionId!);
  }

}