import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CriteriaSetDetailComponent } from './criteria-set-detail.component';

describe('CriteriaSet Management Detail Component', () => {
  let comp: CriteriaSetDetailComponent;
  let fixture: ComponentFixture<CriteriaSetDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaSetDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ criteriaSet: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CriteriaSetDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CriteriaSetDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load criteriaSet on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.criteriaSet).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
