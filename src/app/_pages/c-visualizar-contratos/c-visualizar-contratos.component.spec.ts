import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CVisualizarContratosComponent } from './c-visualizar-contratos.component';

describe('CVisualizarContratosComponent', () => {
  let component: CVisualizarContratosComponent;
  let fixture: ComponentFixture<CVisualizarContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CVisualizarContratosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CVisualizarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
