import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParameterValueDetailComponent } from './parameter-value-detail.component';

describe('ParameterValue Management Detail Component', () => {
  let comp: ParameterValueDetailComponent;
  let fixture: ComponentFixture<ParameterValueDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterValueDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parameterValue: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParameterValueDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParameterValueDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parameterValue on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parameterValue).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
