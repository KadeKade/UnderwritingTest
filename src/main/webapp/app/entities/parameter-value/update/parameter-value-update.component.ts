import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ParameterValueFormService, ParameterValueFormGroup } from './parameter-value-form.service';
import { IParameterValue } from '../parameter-value.model';
import { ParameterValueService } from '../service/parameter-value.service';
import { IParameter } from 'app/entities/parameter/parameter.model';
import { ParameterService } from 'app/entities/parameter/service/parameter.service';
import { ICriteria } from 'app/entities/criteria/criteria.model';
import { CriteriaService } from 'app/entities/criteria/service/criteria.service';

@Component({
  selector: 'jhi-parameter-value-update',
  templateUrl: './parameter-value-update.component.html',
})
export class ParameterValueUpdateComponent implements OnInit {
  isSaving = false;
  parameterValue: IParameterValue | null = null;

  parametersSharedCollection: IParameter[] = [];
  criteriaSharedCollection: ICriteria[] = [];

  editForm: ParameterValueFormGroup = this.parameterValueFormService.createParameterValueFormGroup();

  constructor(
    protected parameterValueService: ParameterValueService,
    protected parameterValueFormService: ParameterValueFormService,
    protected parameterService: ParameterService,
    protected criteriaService: CriteriaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParameter = (o1: IParameter | null, o2: IParameter | null): boolean => this.parameterService.compareParameter(o1, o2);

  compareCriteria = (o1: ICriteria | null, o2: ICriteria | null): boolean => this.criteriaService.compareCriteria(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parameterValue }) => {
      this.parameterValue = parameterValue;
      if (parameterValue) {
        this.updateForm(parameterValue);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parameterValue = this.parameterValueFormService.getParameterValue(this.editForm);
    if (parameterValue.id !== null) {
      this.subscribeToSaveResponse(this.parameterValueService.update(parameterValue));
    } else {
      this.subscribeToSaveResponse(this.parameterValueService.create(parameterValue));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParameterValue>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(parameterValue: IParameterValue): void {
    this.parameterValue = parameterValue;
    this.parameterValueFormService.resetForm(this.editForm, parameterValue);

    this.parametersSharedCollection = this.parameterService.addParameterToCollectionIfMissing<IParameter>(
      this.parametersSharedCollection,
      parameterValue.actionParameter
    );
    this.criteriaSharedCollection = this.criteriaService.addCriteriaToCollectionIfMissing<ICriteria>(
      this.criteriaSharedCollection,
      parameterValue.criteria
    );
  }

  protected loadRelationshipsOptions(): void {
    this.parameterService
      .query()
      .pipe(map((res: HttpResponse<IParameter[]>) => res.body ?? []))
      .pipe(
        map((parameters: IParameter[]) =>
          this.parameterService.addParameterToCollectionIfMissing<IParameter>(parameters, this.parameterValue?.actionParameter)
        )
      )
      .subscribe((parameters: IParameter[]) => (this.parametersSharedCollection = parameters));

    this.criteriaService
      .query()
      .pipe(map((res: HttpResponse<ICriteria[]>) => res.body ?? []))
      .pipe(
        map((criteria: ICriteria[]) =>
          this.criteriaService.addCriteriaToCollectionIfMissing<ICriteria>(criteria, this.parameterValue?.criteria)
        )
      )
      .subscribe((criteria: ICriteria[]) => (this.criteriaSharedCollection = criteria));
  }
}
