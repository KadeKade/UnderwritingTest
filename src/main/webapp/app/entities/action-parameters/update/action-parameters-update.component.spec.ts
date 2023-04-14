import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActionParametersFormService } from './action-parameters-form.service';
import { ActionParametersService } from '../service/action-parameters.service';
import { IActionParameters } from '../action-parameters.model';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';

import { ActionParametersUpdateComponent } from './action-parameters-update.component';

describe('ActionParameters Management Update Component', () => {
  let comp: ActionParametersUpdateComponent;
  let fixture: ComponentFixture<ActionParametersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actionParametersFormService: ActionParametersFormService;
  let actionParametersService: ActionParametersService;
  let actionService: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActionParametersUpdateComponent],
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
      .overrideTemplate(ActionParametersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActionParametersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actionParametersFormService = TestBed.inject(ActionParametersFormService);
    actionParametersService = TestBed.inject(ActionParametersService);
    actionService = TestBed.inject(ActionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Action query and add missing value', () => {
      const actionParameters: IActionParameters = { id: 456 };
      const action: IAction = { id: 42608 };
      actionParameters.action = action;

      const actionCollection: IAction[] = [{ id: 60532 }];
      jest.spyOn(actionService, 'query').mockReturnValue(of(new HttpResponse({ body: actionCollection })));
      const additionalActions = [action];
      const expectedCollection: IAction[] = [...additionalActions, ...actionCollection];
      jest.spyOn(actionService, 'addActionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ actionParameters });
      comp.ngOnInit();

      expect(actionService.query).toHaveBeenCalled();
      expect(actionService.addActionToCollectionIfMissing).toHaveBeenCalledWith(
        actionCollection,
        ...additionalActions.map(expect.objectContaining)
      );
      expect(comp.actionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const actionParameters: IActionParameters = { id: 456 };
      const action: IAction = { id: 78650 };
      actionParameters.action = action;

      activatedRoute.data = of({ actionParameters });
      comp.ngOnInit();

      expect(comp.actionsSharedCollection).toContain(action);
      expect(comp.actionParameters).toEqual(actionParameters);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameters>>();
      const actionParameters = { id: 123 };
      jest.spyOn(actionParametersFormService, 'getActionParameters').mockReturnValue(actionParameters);
      jest.spyOn(actionParametersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameters });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actionParameters }));
      saveSubject.complete();

      // THEN
      expect(actionParametersFormService.getActionParameters).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(actionParametersService.update).toHaveBeenCalledWith(expect.objectContaining(actionParameters));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameters>>();
      const actionParameters = { id: 123 };
      jest.spyOn(actionParametersFormService, 'getActionParameters').mockReturnValue({ id: null });
      jest.spyOn(actionParametersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameters: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actionParameters }));
      saveSubject.complete();

      // THEN
      expect(actionParametersFormService.getActionParameters).toHaveBeenCalled();
      expect(actionParametersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameters>>();
      const actionParameters = { id: 123 };
      jest.spyOn(actionParametersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameters });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actionParametersService.update).toHaveBeenCalled();
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
  });
});
