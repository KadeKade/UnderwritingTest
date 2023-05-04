import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActionParameterFormService, ActionParameterFormGroup } from './action-parameter-form.service';
import { IActionParameter } from '../action-parameter.model';
import { ActionParameterService } from '../service/action-parameter.service';
import { ICriteria } from 'app/entities/criteria/criteria.model';
import { CriteriaService } from 'app/entities/criteria/service/criteria.service';

@Component({
  selector: 'jhi-action-parameter-update',
  templateUrl: './action-parameter-update.component.html',
})
export class ActionParameterUpdateComponent implements OnInit {
  isSaving = false;
  actionParameter: IActionParameter | null = null;

  criteriaSharedCollection: ICriteria[] = [];

  editForm: ActionParameterFormGroup = this.actionParameterFormService.createActionParameterFormGroup();

  constructor(
    protected actionParameterService: ActionParameterService,
    protected actionParameterFormService: ActionParameterFormService,
    protected criteriaService: CriteriaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCriteria = (o1: ICriteria | null, o2: ICriteria | null): boolean => this.criteriaService.compareCriteria(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionParameter }) => {
      this.actionParameter = actionParameter;
      if (actionParameter) {
        this.updateForm(actionParameter);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actionParameter = this.actionParameterFormService.getActionParameter(this.editForm);
    if (actionParameter.id !== null) {
      this.subscribeToSaveResponse(this.actionParameterService.update(actionParameter));
    } else {
      this.subscribeToSaveResponse(this.actionParameterService.create(actionParameter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActionParameter>>): void {
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

  protected updateForm(actionParameter: IActionParameter): void {
    this.actionParameter = actionParameter;
    this.actionParameterFormService.resetForm(this.editForm, actionParameter);

    this.criteriaSharedCollection = this.criteriaService.addCriteriaToCollectionIfMissing<ICriteria>(
      this.criteriaSharedCollection,
      actionParameter.criteria
    );
  }

  protected loadRelationshipsOptions(): void {
    this.criteriaService
      .query()
      .pipe(map((res: HttpResponse<ICriteria[]>) => res.body ?? []))
      .pipe(
        map((criteria: ICriteria[]) =>
          this.criteriaService.addCriteriaToCollectionIfMissing<ICriteria>(criteria, this.actionParameter?.criteria)
        )
      )
      .subscribe((criteria: ICriteria[]) => (this.criteriaSharedCollection = criteria));
  }
}
