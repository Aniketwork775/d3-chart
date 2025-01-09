import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalLayoutComponent } from './horizontal-layout.component';

describe('HorizontalLayoutComponent', () => {
  let component: HorizontalLayoutComponent;
  let fixture: ComponentFixture<HorizontalLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalLayoutComponent]
    });
    fixture = TestBed.createComponent(HorizontalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
