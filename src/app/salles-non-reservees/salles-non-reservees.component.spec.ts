import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SallesNonReserveesComponent } from './salles-non-reservees.component';

describe('SallesNonReserveesComponent', () => {
  let component: SallesNonReserveesComponent;
  let fixture: ComponentFixture<SallesNonReserveesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SallesNonReserveesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SallesNonReserveesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
