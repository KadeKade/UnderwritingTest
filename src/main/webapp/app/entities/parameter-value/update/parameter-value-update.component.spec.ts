import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParameterValueFormService } from './parameter-value-form.service';
import { ParameterValueService } from '../service/parameter-value.service';
import { IParameterValue } from '../parameter-value.model';
import { IParameter } from 'app/entities/parameter/parameter.model';
import { ParameterService } from 'app/entities/parameter/service/parameter.service';
import { ICriteria } from 'app/entities/criteria/criteria.model';
import { CriteriaService } from 'app/entities/criteria/service/criteria.service';

import { ParameterValueUpdateComponent } from './parameter-value-update.component';

describe('ParameterValue Management Update Component', () => {
  let comp: ParameterValueUpdateComponent;
  let fixture: ComponentFixture<ParameterValueUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parameterValueFormService: ParameterValueFormService;
  let parameterValueService: ParameterValueService;
  let parameterService: ParameterService;
  let criteriaService: CriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParameterValueUpdateComponent],
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
      .overrideTemplate(ParameterValueUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterValueUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parameterValueFormService = TestBed.inject(ParameterValueFormService);
    parameterValueService = TestBed.inject(ParameterValueService);
    parameterService = TestBed.inject(ParameterService);
    criteriaService = TestBed.inject(CriteriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Parameter query and add missing value', () => {
      const parameterValue: IParameterValue = { id: 456 };
      const actionParameter: IParameter = { id: 87068 };
      parameterValue.actionParameter = actionParameter;

      const parameterCollection: IParameter[] = [{ id: 15743 }];
      jest.spyOn(parameterService, 'query').mockReturnValue(of(new HttpResponse({ body: parameterCollection })));
      const additionalParameters = [actionParameter];
      const expectedCollection: IParameter[] = [...additionalParameters, ...parameterCollection];
      jest.spyOn(parameterService, 'addParameterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parameterValue });
      comp.ngOnInit();

      expect(parameterService.query).toHaveBeenCalled();
      expect(parameterService.addParameterToCollectionIfMissing).toHaveBeenCalledWith(
        parameterCollection,
        ...additionalParameters.map(expect.objectContaining)
      );
      expect(comp.parametersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Criteria query and add missing value', () => {
      const parameterValue: IParameterValue = { id: 456 };
      const criteria: ICriteria = { id: 53297 };
      parameterValue.criteria = criteria;

      const criteriaCollection: ICriteria[] = [{ id: 9643 }];
      jest.spyOn(criteriaService, 'query').mockReturnValue(of(new HttpResponse({ body: criteriaCollection })));
      const additionalCriteria = [criteria];
      const expectedCollection: ICriteria[] = [...additionalCriteria, ...criteriaCollection];
      jest.spyOn(criteriaService, 'addCriteriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parameterValue });
      comp.ngOnInit();

      expect(criteriaService.query).toHaveBeenCalled();
      expect(criteriaService.addCriteriaToCollectionIfMissing).toHaveBeenCalledWith(
        criteriaCollection,
        ...additionalCriteria.map(expect.objectContaining)
      );
      expect(comp.criteriaSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parameterValue: IParameterValue = { id: 456 };
      const actionParameter: IParameter = { id: 24082 };
      parameterValue.actionParameter = actionParameter;
      const criteria: ICriteria = { id: 27350 };
      parameterValue.criteria = criteria;

      activatedRoute.data = of({ parameterValue });
      comp.ngOnInit();

      expect(comp.parametersSharedCollection).toContain(actionParameter);
      expect(comp.criteriaSharedCollection).toContain(criteria);
      expect(comp.parameterValue).toEqual(parameterValue);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameterValue>>();
      const parameterValue = { id: 123 };
      jest.spyOn(parameterValueFormService, 'getParameterValue').mockReturnValue(parameterValue);
      jest.spyOn(parameterValueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameterValue });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameterValue }));
      saveSubject.complete();

      // THEN
      expect(parameterValueFormService.getParameterValue).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(parameterValueService.update).toHaveBeenCalledWith(expect.objectContaining(parameterValue));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameterValue>>();
      const parameterValue = { id: 123 };
      jest.spyOn(parameterValueFormService, 'getParameterValue').mockReturnValue({ id: null });
      jest.spyOn(parameterValueService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameterValue: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameterValue }));
      saveSubject.complete();

      // THEN
      expect(parameterValueFormService.getParameterValue).toHaveBeenCalled();
      expect(parameterValueService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameterValue>>();
      const parameterValue = { id: 123 };
      jest.spyOn(parameterValueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameterValue });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parameterValueService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareParameter', () => {
      it('Should forward to parameterService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(parameterService, 'compareParameter');
        comp.compareParameter(entity, entity2);
        expect(parameterService.compareParameter).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCriteria', () => {
      it('Should forward to criteriaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(criteriaService, 'compareCriteria');
        comp.compareCriteria(entity, entity2);
        expect(criteriaService.compareCriteria).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
