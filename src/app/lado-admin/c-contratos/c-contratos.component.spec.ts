import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CContratosComponent } from './c-contratos.component';

describe('CContratosComponent', () => {
  let component: CContratosComponent;
  let fixture: ComponentFixture<CContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CContratosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
