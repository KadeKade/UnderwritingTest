import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParameterFormService } from './parameter-form.service';
import { ParameterService } from '../service/parameter.service';
import { IParameter } from '../parameter.model';

import { ParameterUpdateComponent } from './parameter-update.component';

describe('Parameter Management Update Component', () => {
  let comp: ParameterUpdateComponent;
  let fixture: ComponentFixture<ParameterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parameterFormService: ParameterFormService;
  let parameterService: ParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParameterUpdateComponent],
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
      .overrideTemplate(ParameterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parameterFormService = TestBed.inject(ParameterFormService);
    parameterService = TestBed.inject(ParameterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const parameter: IParameter = { id: 456 };

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(comp.parameter).toEqual(parameter);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterFormService, 'getParameter').mockReturnValue(parameter);
      jest.spyOn(parameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameter }));
      saveSubject.complete();

      // THEN
      expect(parameterFormService.getParameter).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(parameterService.update).toHaveBeenCalledWith(expect.objectContaining(parameter));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterFormService, 'getParameter').mockReturnValue({ id: null });
      jest.spyOn(parameterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameter }));
      saveSubject.complete();

      // THEN
      expect(parameterFormService.getParameter).toHaveBeenCalled();
      expect(parameterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parameterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
