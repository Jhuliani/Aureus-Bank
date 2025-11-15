import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDashboardAdminComponent } from './c-dashboard-admin.component';

describe('CDashboardAdminComponent', () => {
  let component: CDashboardAdminComponent;
  let fixture: ComponentFixture<CDashboardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CDashboardAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDashboardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

