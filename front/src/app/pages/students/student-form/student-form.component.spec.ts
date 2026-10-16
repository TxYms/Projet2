import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../core/service/student.service';
import { StudentMockService } from '../../../core/service/student-mock.service';

// Le même composant sert à la création (/students/new) et à la modification (/students/:id/edit)
function setup(id: string | null): ComponentFixture<StudentFormComponent> {
  TestBed.configureTestingModule({
    imports: [StudentFormComponent],
    providers: [
      provideRouter([]),
      { provide: StudentService, useClass: StudentMockService },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } },
    ]
  });
  jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  const fixture = TestBed.createComponent(StudentFormComponent);
  fixture.detectChanges();
  return fixture;
}

const ALICE = { firstName: 'Alice', lastName: 'Martin', email: 'alice@mail.com' };

describe('StudentFormComponent', () => {
  it('should create the student and go to its detail page', () => {
    // GIVEN : URL /students/new
    const component = setup(null).componentInstance;
    const createSpy = jest.spyOn(TestBed.inject(StudentService), 'create');

    // WHEN : formulaire rempli et validé
    component.studentForm.setValue(ALICE);
    component.onSubmit();

    // THEN : l'étudiant est créé, puis redirection vers son détail (le mock renvoie l'id 2)
    expect(createSpy).toHaveBeenCalledWith(ALICE);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/students', 2]);
  });

  it('should prefill the form and update the student', () => {
    // GIVEN : URL /students/1/edit -> le formulaire est pré-rempli avec l'étudiant 1
    const component = setup('1').componentInstance;
    expect(component.studentForm.value).toEqual(ALICE);
    const updateSpy = jest.spyOn(TestBed.inject(StudentService), 'update');

    // WHEN : on change le nom et on valide
    component.studentForm.patchValue({ lastName: 'Durand' });
    component.onSubmit();

    // THEN : l'étudiant 1 est modifié
    expect(updateSpy).toHaveBeenCalledWith(1, { ...ALICE, lastName: 'Durand' });
  });
});
