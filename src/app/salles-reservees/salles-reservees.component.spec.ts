import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SallesReserveesComponent } from './salles-reservees.component';

describe('SallesReserveesComponent', () => {
  let component: SallesReserveesComponent;
  let fixture: ComponentFixture<SallesReserveesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SallesReserveesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SallesReserveesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
