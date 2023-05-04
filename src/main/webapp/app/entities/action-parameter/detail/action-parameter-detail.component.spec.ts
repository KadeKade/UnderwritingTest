import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActionParameterDetailComponent } from './action-parameter-detail.component';

describe('ActionParameter Management Detail Component', () => {
  let comp: ActionParameterDetailComponent;
  let fixture: ComponentFixture<ActionParameterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionParameterDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ actionParameter: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActionParameterDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActionParameterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load actionParameter on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.actionParameter).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
