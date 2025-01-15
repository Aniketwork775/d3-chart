import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleLayoutComponent } from './circle-layout.component';

describe('CircleLayoutComponent', () => {
  let component: CircleLayoutComponent;
  let fixture: ComponentFixture<CircleLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CircleLayoutComponent]
    });
    fixture = TestBed.createComponent(CircleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
