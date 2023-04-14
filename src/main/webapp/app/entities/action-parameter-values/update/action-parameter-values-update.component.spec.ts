import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActionParameterValuesFormService } from './action-parameter-values-form.service';
import { ActionParameterValuesService } from '../service/action-parameter-values.service';
import { IActionParameterValues } from '../action-parameter-values.model';
import { IActionParameters } from 'app/entities/action-parameters/action-parameters.model';
import { ActionParametersService } from 'app/entities/action-parameters/service/action-parameters.service';

import { ActionParameterValuesUpdateComponent } from './action-parameter-values-update.component';

describe('ActionParameterValues Management Update Component', () => {
  let comp: ActionParameterValuesUpdateComponent;
  let fixture: ComponentFixture<ActionParameterValuesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actionParameterValuesFormService: ActionParameterValuesFormService;
  let actionParameterValuesService: ActionParameterValuesService;
  let actionParametersService: ActionParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActionParameterValuesUpdateComponent],
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
      .overrideTemplate(ActionParameterValuesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActionParameterValuesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actionParameterValuesFormService = TestBed.inject(ActionParameterValuesFormService);
    actionParameterValuesService = TestBed.inject(ActionParameterValuesService);
    actionParametersService = TestBed.inject(ActionParametersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ActionParameters query and add missing value', () => {
      const actionParameterValues: IActionParameterValues = { id: 456 };
      const parameter: IActionParameters = { id: 26887 };
      actionParameterValues.parameter = parameter;

      const actionParametersCollection: IActionParameters[] = [{ id: 30478 }];
      jest.spyOn(actionParametersService, 'query').mockReturnValue(of(new HttpResponse({ body: actionParametersCollection })));
      const additionalActionParameters = [parameter];
      const expectedCollection: IActionParameters[] = [...additionalActionParameters, ...actionParametersCollection];
      jest.spyOn(actionParametersService, 'addActionParametersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ actionParameterValues });
      comp.ngOnInit();

      expect(actionParametersService.query).toHaveBeenCalled();
      expect(actionParametersService.addActionParametersToCollectionIfMissing).toHaveBeenCalledWith(
        actionParametersCollection,
        ...additionalActionParameters.map(expect.objectContaining)
      );
      expect(comp.actionParametersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const actionParameterValues: IActionParameterValues = { id: 456 };
      const parameter: IActionParameters = { id: 72679 };
      actionParameterValues.parameter = parameter;

      activatedRoute.data = of({ actionParameterValues });
      comp.ngOnInit();

      expect(comp.actionParametersSharedCollection).toContain(parameter);
      expect(comp.actionParameterValues).toEqual(actionParameterValues);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameterValues>>();
      const actionParameterValues = { id: 123 };
      jest.spyOn(actionParameterValuesFormService, 'getActionParameterValues').mockReturnValue(actionParameterValues);
      jest.spyOn(actionParameterValuesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameterValues });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actionParameterValues }));
      saveSubject.complete();

      // THEN
      expect(actionParameterValuesFormService.getActionParameterValues).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(actionParameterValuesService.update).toHaveBeenCalledWith(expect.objectContaining(actionParameterValues));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameterValues>>();
      const actionParameterValues = { id: 123 };
      jest.spyOn(actionParameterValuesFormService, 'getActionParameterValues').mockReturnValue({ id: null });
      jest.spyOn(actionParameterValuesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameterValues: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actionParameterValues }));
      saveSubject.complete();

      // THEN
      expect(actionParameterValuesFormService.getActionParameterValues).toHaveBeenCalled();
      expect(actionParameterValuesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameterValues>>();
      const actionParameterValues = { id: 123 };
      jest.spyOn(actionParameterValuesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameterValues });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actionParameterValuesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareActionParameters', () => {
      it('Should forward to actionParametersService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(actionParametersService, 'compareActionParameters');
        comp.compareActionParameters(entity, entity2);
        expect(actionParametersService.compareActionParameters).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
