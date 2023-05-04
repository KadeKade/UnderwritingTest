import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CriteriaParameterDetailComponent } from './criteria-parameter-detail.component';

describe('CriteriaParameter Management Detail Component', () => {
  let comp: CriteriaParameterDetailComponent;
  let fixture: ComponentFixture<CriteriaParameterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaParameterDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ criteriaParameter: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CriteriaParameterDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CriteriaParameterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load criteriaParameter on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.criteriaParameter).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
