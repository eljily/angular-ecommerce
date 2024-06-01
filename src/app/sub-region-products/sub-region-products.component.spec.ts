import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRegionProductsComponent } from './sub-region-products.component';

describe('SubRegionProductsComponent', () => {
  let component: SubRegionProductsComponent;
  let fixture: ComponentFixture<SubRegionProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubRegionProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubRegionProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
