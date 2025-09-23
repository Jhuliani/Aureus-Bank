import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPainelclienteComponent } from './c-painelcliente.component';

describe('CPainelclienteComponent', () => {
  let component: CPainelclienteComponent;
  let fixture: ComponentFixture<CPainelclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPainelclienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CPainelclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
