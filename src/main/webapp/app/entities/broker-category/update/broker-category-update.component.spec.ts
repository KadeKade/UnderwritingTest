import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BrokerCategoryFormService } from './broker-category-form.service';
import { BrokerCategoryService } from '../service/broker-category.service';
import { IBrokerCategory } from '../broker-category.model';

import { BrokerCategoryUpdateComponent } from './broker-category-update.component';

describe('BrokerCategory Management Update Component', () => {
  let comp: BrokerCategoryUpdateComponent;
  let fixture: ComponentFixture<BrokerCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let brokerCategoryFormService: BrokerCategoryFormService;
  let brokerCategoryService: BrokerCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BrokerCategoryUpdateComponent],
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
      .overrideTemplate(BrokerCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BrokerCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    brokerCategoryFormService = TestBed.inject(BrokerCategoryFormService);
    brokerCategoryService = TestBed.inject(BrokerCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const brokerCategory: IBrokerCategory = { id: 456 };

      activatedRoute.data = of({ brokerCategory });
      comp.ngOnInit();

      expect(comp.brokerCategory).toEqual(brokerCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBrokerCategory>>();
      const brokerCategory = { id: 123 };
      jest.spyOn(brokerCategoryFormService, 'getBrokerCategory').mockReturnValue(brokerCategory);
      jest.spyOn(brokerCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ brokerCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: brokerCategory }));
      saveSubject.complete();

      // THEN
      expect(brokerCategoryFormService.getBrokerCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(brokerCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(brokerCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBrokerCategory>>();
      const brokerCategory = { id: 123 };
      jest.spyOn(brokerCategoryFormService, 'getBrokerCategory').mockReturnValue({ id: null });
      jest.spyOn(brokerCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ brokerCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: brokerCategory }));
      saveSubject.complete();

      // THEN
      expect(brokerCategoryFormService.getBrokerCategory).toHaveBeenCalled();
      expect(brokerCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBrokerCategory>>();
      const brokerCategory = { id: 123 };
      jest.spyOn(brokerCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ brokerCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(brokerCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
