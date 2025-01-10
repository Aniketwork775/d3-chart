import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalLayoutComponent } from './vertical-layout.component';

describe('VerticalLayoutComponent', () => {
  let component: VerticalLayoutComponent;
  let fixture: ComponentFixture<VerticalLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalLayoutComponent]
    });
    fixture = TestBed.createComponent(VerticalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
