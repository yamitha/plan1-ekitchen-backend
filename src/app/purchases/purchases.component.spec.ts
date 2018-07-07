import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { purchasesComponent } from './purchases.component';

describe('PurchasesComponent', () => {
  let component: purchasesComponent;
  let fixture: ComponentFixture<purchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ purchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(purchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
