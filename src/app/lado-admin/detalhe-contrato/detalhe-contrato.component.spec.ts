import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheContratoComponent } from './detalhe-contrato.component';

describe('DetalheContratoComponent', () => {
  let component: DetalheContratoComponent;
  let fixture: ComponentFixture<DetalheContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheContratoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

