import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActionParameterValuesDetailComponent } from './action-parameter-values-detail.component';

describe('ActionParameterValues Management Detail Component', () => {
  let comp: ActionParameterValuesDetailComponent;
  let fixture: ComponentFixture<ActionParameterValuesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionParameterValuesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ actionParameterValues: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActionParameterValuesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActionParameterValuesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load actionParameterValues on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.actionParameterValues).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
