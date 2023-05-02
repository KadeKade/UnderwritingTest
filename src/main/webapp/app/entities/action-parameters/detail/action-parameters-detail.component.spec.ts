import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActionParametersDetailComponent } from './action-parameters-detail.component';

describe('ActionParameters Management Detail Component', () => {
  let comp: ActionParametersDetailComponent;
  let fixture: ComponentFixture<ActionParametersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionParametersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ actionParameters: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActionParametersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActionParametersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load actionParameters on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.actionParameters).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
