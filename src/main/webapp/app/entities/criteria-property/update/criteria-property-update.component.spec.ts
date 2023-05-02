import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaPropertyFormService } from './criteria-property-form.service';
import { CriteriaPropertyService } from '../service/criteria-property.service';
import { ICriteriaProperty } from '../criteria-property.model';
import { ICriteria } from 'app/entities/criteria/criteria.model';
import { CriteriaService } from 'app/entities/criteria/service/criteria.service';

import { CriteriaPropertyUpdateComponent } from './criteria-property-update.component';

describe('CriteriaProperty Management Update Component', () => {
  let comp: CriteriaPropertyUpdateComponent;
  let fixture: ComponentFixture<CriteriaPropertyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaPropertyFormService: CriteriaPropertyFormService;
  let criteriaPropertyService: CriteriaPropertyService;
  let criteriaService: CriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CriteriaPropertyUpdateComponent],
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
      .overrideTemplate(CriteriaPropertyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaPropertyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaPropertyFormService = TestBed.inject(CriteriaPropertyFormService);
    criteriaPropertyService = TestBed.inject(CriteriaPropertyService);
    criteriaService = TestBed.inject(CriteriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Criteria query and add missing value', () => {
      const criteriaProperty: ICriteriaProperty = { id: 456 };
      const property: ICriteria = { id: 85478 };
      criteriaProperty.property = property;

      const criteriaCollection: ICriteria[] = [{ id: 55460 }];
      jest.spyOn(criteriaService, 'query').mockReturnValue(of(new HttpResponse({ body: criteriaCollection })));
      const additionalCriteria = [property];
      const expectedCollection: ICriteria[] = [...additionalCriteria, ...criteriaCollection];
      jest.spyOn(criteriaService, 'addCriteriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteriaProperty });
      comp.ngOnInit();

      expect(criteriaService.query).toHaveBeenCalled();
      expect(criteriaService.addCriteriaToCollectionIfMissing).toHaveBeenCalledWith(
        criteriaCollection,
        ...additionalCriteria.map(expect.objectContaining)
      );
      expect(comp.criteriaSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const criteriaProperty: ICriteriaProperty = { id: 456 };
      const property: ICriteria = { id: 13440 };
      criteriaProperty.property = property;

      activatedRoute.data = of({ criteriaProperty });
      comp.ngOnInit();

      expect(comp.criteriaSharedCollection).toContain(property);
      expect(comp.criteriaProperty).toEqual(criteriaProperty);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaProperty>>();
      const criteriaProperty = { id: 123 };
      jest.spyOn(criteriaPropertyFormService, 'getCriteriaProperty').mockReturnValue(criteriaProperty);
      jest.spyOn(criteriaPropertyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaProperty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaProperty }));
      saveSubject.complete();

      // THEN
      expect(criteriaPropertyFormService.getCriteriaProperty).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaPropertyService.update).toHaveBeenCalledWith(expect.objectContaining(criteriaProperty));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaProperty>>();
      const criteriaProperty = { id: 123 };
      jest.spyOn(criteriaPropertyFormService, 'getCriteriaProperty').mockReturnValue({ id: null });
      jest.spyOn(criteriaPropertyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaProperty: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaProperty }));
      saveSubject.complete();

      // THEN
      expect(criteriaPropertyFormService.getCriteriaProperty).toHaveBeenCalled();
      expect(criteriaPropertyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaProperty>>();
      const criteriaProperty = { id: 123 };
      jest.spyOn(criteriaPropertyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaProperty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaPropertyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
