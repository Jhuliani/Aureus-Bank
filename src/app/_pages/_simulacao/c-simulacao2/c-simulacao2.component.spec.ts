import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSimulacao2Component } from './c-simulacao2.component';

describe('CSimulacao2Component', () => {
  let component: CSimulacao2Component;
  let fixture: ComponentFixture<CSimulacao2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CSimulacao2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CSimulacao2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
