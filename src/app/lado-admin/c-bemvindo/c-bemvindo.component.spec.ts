import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBemvindoComponent } from './c-bemvindo.component';

describe('CBemvindoComponent', () => {
  let component: CBemvindoComponent;
  let fixture: ComponentFixture<CBemvindoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CBemvindoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CBemvindoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
