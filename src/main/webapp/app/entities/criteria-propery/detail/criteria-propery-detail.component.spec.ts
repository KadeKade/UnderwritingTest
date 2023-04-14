import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CriteriaProperyDetailComponent } from './criteria-propery-detail.component';

describe('CriteriaPropery Management Detail Component', () => {
  let comp: CriteriaProperyDetailComponent;
  let fixture: ComponentFixture<CriteriaProperyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaProperyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ criteriaPropery: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CriteriaProperyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CriteriaProperyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load criteriaPropery on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.criteriaPropery).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
