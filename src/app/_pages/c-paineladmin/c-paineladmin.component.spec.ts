import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPaineladminComponent } from './c-paineladmin.component';

describe('CPaineladminComponent', () => {
  let component: CPaineladminComponent;
  let fixture: ComponentFixture<CPaineladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPaineladminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CPaineladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
