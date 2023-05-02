import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CriteriaPropertyDetailComponent } from './criteria-property-detail.component';

describe('CriteriaProperty Management Detail Component', () => {
  let comp: CriteriaPropertyDetailComponent;
  let fixture: ComponentFixture<CriteriaPropertyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaPropertyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ criteriaProperty: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CriteriaPropertyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CriteriaPropertyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load criteriaProperty on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.criteriaProperty).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
