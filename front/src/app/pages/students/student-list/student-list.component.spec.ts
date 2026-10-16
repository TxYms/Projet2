import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../../core/service/student.service';
import { StudentMockService } from '../../../core/service/student-mock.service';

// Tests d'intégration de l'écran liste : composant + template, StudentService remplacé par un mock
describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useClass: StudentMockService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display one row per student', () => {
    // le mock renvoie 1 étudiant : Alice Martin
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('alice@mail.com');
  });

  it('should remove the row after a deletion', () => {
    // GIVEN : l'utilisateur confirme la suppression
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // WHEN : clic sur le bouton Delete de la ligne
    fixture.nativeElement.querySelector('button.btn-danger').click();
    fixture.detectChanges();

    // THEN : la ligne a disparu
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(0);
  });
});
