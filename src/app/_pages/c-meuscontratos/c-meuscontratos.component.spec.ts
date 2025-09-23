import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMeuscontratosComponent } from './c-meuscontratos.component';

describe('CMeuscontratosComponent', () => {
  let component: CMeuscontratosComponent;
  let fixture: ComponentFixture<CMeuscontratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CMeuscontratosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CMeuscontratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
