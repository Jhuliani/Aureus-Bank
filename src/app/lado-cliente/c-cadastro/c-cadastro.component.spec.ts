import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCadastroComponent } from './c-cadastro.component';

describe('CCadastroComponent', () => {
  let component: CCadastroComponent;
  let fixture: ComponentFixture<CCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CCadastroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
