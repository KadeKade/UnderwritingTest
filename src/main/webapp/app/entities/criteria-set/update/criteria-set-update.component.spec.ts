import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaSetFormService } from './criteria-set-form.service';
import { CriteriaSetService } from '../service/criteria-set.service';
import { ICriteriaSet } from '../criteria-set.model';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';
import { IActionParameterValues } from 'app/entities/action-parameter-values/action-parameter-values.model';
import { ActionParameterValuesService } from 'app/entities/action-parameter-values/service/action-parameter-values.service';

import { CriteriaSetUpdateComponent } from './criteria-set-update.component';

describe('CriteriaSet Management Update Component', () => {
  let comp: CriteriaSetUpdateComponent;
  let fixture: ComponentFixture<CriteriaSetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaSetFormService: CriteriaSetFormService;
  let criteriaSetService: CriteriaSetService;
  let actionService: ActionService;
  let actionParameterValuesService: ActionParameterValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CriteriaSetUpdateComponent],
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
      .overrideTemplate(CriteriaSetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaSetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaSetFormService = TestBed.inject(CriteriaSetFormService);
    criteriaSetService = TestBed.inject(CriteriaSetService);
    actionService = TestBed.inject(ActionService);
    actionParameterValuesService = TestBed.inject(ActionParameterValuesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Action query and add missing value', () => {
      const criteriaSet: ICriteriaSet = { id: 456 };
      const positiveAction: IAction = { id: 30235 };
      criteriaSet.positiveAction = positiveAction;
      const negativeAction: IAction = { id: 480 };
      criteriaSet.negativeAction = negativeAction;

      const actionCollection: IAction[] = [{ id: 97295 }];
      jest.spyOn(actionService, 'query').mockReturnValue(of(new HttpResponse({ body: actionCollection })));
      const additionalActions = [positiveAction, negativeAction];
      const expectedCollection: IAction[] = [...additionalActions, ...actionCollection];
      jest.spyOn(actionService, 'addActionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      expect(actionService.query).toHaveBeenCalled();
      expect(actionService.addActionToCollectionIfMissing).toHaveBeenCalledWith(
        actionCollection,
        ...additionalActions.map(expect.objectContaining)
      );
      expect(comp.actionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ActionParameterValues query and add missing value', () => {
      const criteriaSet: ICriteriaSet = { id: 456 };
      const positiveActionParameters: IActionParameterValues = { id: 52780 };
      criteriaSet.positiveActionParameters = positiveActionParameters;
      const negativeActionParameters: IActionParameterValues = { id: 24693 };
      criteriaSet.negativeActionParameters = negativeActionParameters;

      const actionParameterValuesCollection: IActionParameterValues[] = [{ id: 91941 }];
      jest.spyOn(actionParameterValuesService, 'query').mockReturnValue(of(new HttpResponse({ body: actionParameterValuesCollection })));
      const additionalActionParameterValues = [positiveActionParameters, negativeActionParameters];
      const expectedCollection: IActionParameterValues[] = [...additionalActionParameterValues, ...actionParameterValuesCollection];
      jest.spyOn(actionParameterValuesService, 'addActionParameterValuesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      expect(actionParameterValuesService.query).toHaveBeenCalled();
      expect(actionParameterValuesService.addActionParameterValuesToCollectionIfMissing).toHaveBeenCalledWith(
        actionParameterValuesCollection,
        ...additionalActionParameterValues.map(expect.objectContaining)
      );
      expect(comp.actionParameterValuesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const criteriaSet: ICriteriaSet = { id: 456 };
      const positiveAction: IAction = { id: 89976 };
      criteriaSet.positiveAction = positiveAction;
      const negativeAction: IAction = { id: 40494 };
      criteriaSet.negativeAction = negativeAction;
      const positiveActionParameters: IActionParameterValues = { id: 98718 };
      criteriaSet.positiveActionParameters = positiveActionParameters;
      const negativeActionParameters: IActionParameterValues = { id: 8404 };
      criteriaSet.negativeActionParameters = negativeActionParameters;

      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      expect(comp.actionsSharedCollection).toContain(positiveAction);
      expect(comp.actionsSharedCollection).toContain(negativeAction);
      expect(comp.actionParameterValuesSharedCollection).toContain(positiveActionParameters);
      expect(comp.actionParameterValuesSharedCollection).toContain(negativeActionParameters);
      expect(comp.criteriaSet).toEqual(criteriaSet);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaSet>>();
      const criteriaSet = { id: 123 };
      jest.spyOn(criteriaSetFormService, 'getCriteriaSet').mockReturnValue(criteriaSet);
      jest.spyOn(criteriaSetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaSet }));
      saveSubject.complete();

      // THEN
      expect(criteriaSetFormService.getCriteriaSet).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaSetService.update).toHaveBeenCalledWith(expect.objectContaining(criteriaSet));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaSet>>();
      const criteriaSet = { id: 123 };
      jest.spyOn(criteriaSetFormService, 'getCriteriaSet').mockReturnValue({ id: null });
      jest.spyOn(criteriaSetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaSet: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaSet }));
      saveSubject.complete();

      // THEN
      expect(criteriaSetFormService.getCriteriaSet).toHaveBeenCalled();
      expect(criteriaSetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaSet>>();
      const criteriaSet = { id: 123 };
      jest.spyOn(criteriaSetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaSetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAction', () => {
      it('Should forward to actionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(actionService, 'compareAction');
        comp.compareAction(entity, entity2);
        expect(actionService.compareAction).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActionParameterValues', () => {
      it('Should forward to actionParameterValuesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(actionParameterValuesService, 'compareActionParameterValues');
        comp.compareActionParameterValues(entity, entity2);
        expect(actionParameterValuesService.compareActionParameterValues).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
