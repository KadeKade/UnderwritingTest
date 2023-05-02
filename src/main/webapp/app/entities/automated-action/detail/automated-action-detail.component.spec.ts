import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AutomatedActionDetailComponent } from './automated-action-detail.component';

describe('AutomatedAction Management Detail Component', () => {
  let comp: AutomatedActionDetailComponent;
  let fixture: ComponentFixture<AutomatedActionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutomatedActionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ automatedAction: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AutomatedActionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AutomatedActionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load automatedAction on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.automatedAction).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
