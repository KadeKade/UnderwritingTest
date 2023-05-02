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

import { ActionParametersUpdateComponent } from './action-parameters-update.component';

describe('ActionParameters Management Update Component', () => {
  let comp: ActionParametersUpdateComponent;
  let fixture: ComponentFixture<ActionParametersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actionParametersFormService: ActionParametersFormService;
  let actionParametersService: ActionParametersService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const actionParameters: IActionParameters = { id: 456 };

      activatedRoute.data = of({ actionParameters });
      comp.ngOnInit();

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
});
