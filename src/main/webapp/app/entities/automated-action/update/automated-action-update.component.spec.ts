import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AutomatedActionFormService } from './automated-action-form.service';
import { AutomatedActionService } from '../service/automated-action.service';
import { IAutomatedAction } from '../automated-action.model';

import { AutomatedActionUpdateComponent } from './automated-action-update.component';

describe('AutomatedAction Management Update Component', () => {
  let comp: AutomatedActionUpdateComponent;
  let fixture: ComponentFixture<AutomatedActionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let automatedActionFormService: AutomatedActionFormService;
  let automatedActionService: AutomatedActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AutomatedActionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AutomatedActionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AutomatedActionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    automatedActionFormService = TestBed.inject(AutomatedActionFormService);
    automatedActionService = TestBed.inject(AutomatedActionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const automatedAction: IAutomatedAction = { id: 456 };

      activatedRoute.data = of({ automatedAction });
      comp.ngOnInit();

      expect(comp.automatedAction).toEqual(automatedAction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutomatedAction>>();
      const automatedAction = { id: 123 };
      jest.spyOn(automatedActionFormService, 'getAutomatedAction').mockReturnValue(automatedAction);
      jest.spyOn(automatedActionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ automatedAction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: automatedAction }));
      saveSubject.complete();

      // THEN
      expect(automatedActionFormService.getAutomatedAction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(automatedActionService.update).toHaveBeenCalledWith(expect.objectContaining(automatedAction));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutomatedAction>>();
      const automatedAction = { id: 123 };
      jest.spyOn(automatedActionFormService, 'getAutomatedAction').mockReturnValue({ id: null });
      jest.spyOn(automatedActionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ automatedAction: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: automatedAction }));
      saveSubject.complete();

      // THEN
      expect(automatedActionFormService.getAutomatedAction).toHaveBeenCalled();
      expect(automatedActionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutomatedAction>>();
      const automatedAction = { id: 123 };
      jest.spyOn(automatedActionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ automatedAction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(automatedActionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
