import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSolicitacaoComponent } from './c-solicitacao.component';

describe('CSolicitacaoComponent', () => {
  let component: CSolicitacaoComponent;
  let fixture: ComponentFixture<CSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CSolicitacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CSolicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
