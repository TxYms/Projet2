import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../../core/service/student.service';
import { StudentMockService } from '../../../core/service/student-mock.service';

// Test d'intégration de l'écran détail : l'id est lu dans l'URL (/students/1)
describe('StudentDetailComponent', () => {
  it('should display the student from the id in the URL', async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useClass: StudentMockService },
        // simule l'URL /students/1
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ]
    }).compileComponents();
    const getByIdSpy = jest.spyOn(TestBed.inject(StudentService), 'getById');

    const fixture: ComponentFixture<StudentDetailComponent> = TestBed.createComponent(StudentDetailComponent);
    fixture.detectChanges();

    expect(getByIdSpy).toHaveBeenCalledWith(1);
    expect(fixture.nativeElement.textContent).toContain('Martin');
    expect(fixture.nativeElement.textContent).toContain('alice@mail.com');
  });
});
