import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CriteriaParameterFormService, CriteriaParameterFormGroup } from './criteria-parameter-form.service';
import { ICriteriaParameter } from '../criteria-parameter.model';
import { CriteriaParameterService } from '../service/criteria-parameter.service';
import { ICriteria } from 'app/entities/criteria/criteria.model';
import { CriteriaService } from 'app/entities/criteria/service/criteria.service';

@Component({
  selector: 'jhi-criteria-parameter-update',
  templateUrl: './criteria-parameter-update.component.html',
})
export class CriteriaParameterUpdateComponent implements OnInit {
  isSaving = false;
  criteriaParameter: ICriteriaParameter | null = null;

  criteriaSharedCollection: ICriteria[] = [];

  editForm: CriteriaParameterFormGroup = this.criteriaParameterFormService.createCriteriaParameterFormGroup();

  constructor(
    protected criteriaParameterService: CriteriaParameterService,
    protected criteriaParameterFormService: CriteriaParameterFormService,
    protected criteriaService: CriteriaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCriteria = (o1: ICriteria | null, o2: ICriteria | null): boolean => this.criteriaService.compareCriteria(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaParameter }) => {
      this.criteriaParameter = criteriaParameter;
      if (criteriaParameter) {
        this.updateForm(criteriaParameter);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteriaParameter = this.criteriaParameterFormService.getCriteriaParameter(this.editForm);
    if (criteriaParameter.id !== null) {
      this.subscribeToSaveResponse(this.criteriaParameterService.update(criteriaParameter));
    } else {
      this.subscribeToSaveResponse(this.criteriaParameterService.create(criteriaParameter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteriaParameter>>): void {
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

  protected updateForm(criteriaParameter: ICriteriaParameter): void {
    this.criteriaParameter = criteriaParameter;
    this.criteriaParameterFormService.resetForm(this.editForm, criteriaParameter);

    this.criteriaSharedCollection = this.criteriaService.addCriteriaToCollectionIfMissing<ICriteria>(
      this.criteriaSharedCollection,
      criteriaParameter.criteria
    );
  }

  protected loadRelationshipsOptions(): void {
    this.criteriaService
      .query()
      .pipe(map((res: HttpResponse<ICriteria[]>) => res.body ?? []))
      .pipe(
        map((criteria: ICriteria[]) =>
          this.criteriaService.addCriteriaToCollectionIfMissing<ICriteria>(criteria, this.criteriaParameter?.criteria)
        )
      )
      .subscribe((criteria: ICriteria[]) => (this.criteriaSharedCollection = criteria));
  }
}
