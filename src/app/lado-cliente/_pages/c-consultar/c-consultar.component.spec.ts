import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CConsultarComponent } from './c-consultar.component';

describe('CConsultarComponent', () => {
  let component: CConsultarComponent;
  let fixture: ComponentFixture<CConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CConsultarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
