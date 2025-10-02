import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSimulacaoComponent } from './c-simulacao.component';

describe('CSimulacaoComponent', () => {
  let component: CSimulacaoComponent;
  let fixture: ComponentFixture<CSimulacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CSimulacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CSimulacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
