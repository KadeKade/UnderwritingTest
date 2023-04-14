import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CriteriaSetFormService, CriteriaSetFormGroup } from './criteria-set-form.service';
import { ICriteriaSet } from '../criteria-set.model';
import { CriteriaSetService } from '../service/criteria-set.service';
import { IAction } from 'app/entities/action/action.model';
import { ActionService } from 'app/entities/action/service/action.service';
import { IActionParameterValues } from 'app/entities/action-parameter-values/action-parameter-values.model';
import { ActionParameterValuesService } from 'app/entities/action-parameter-values/service/action-parameter-values.service';

@Component({
  selector: 'jhi-criteria-set-update',
  templateUrl: './criteria-set-update.component.html',
})
export class CriteriaSetUpdateComponent implements OnInit {
  isSaving = false;
  criteriaSet: ICriteriaSet | null = null;

  actionsSharedCollection: IAction[] = [];
  actionParameterValuesSharedCollection: IActionParameterValues[] = [];

  editForm: CriteriaSetFormGroup = this.criteriaSetFormService.createCriteriaSetFormGroup();

  constructor(
    protected criteriaSetService: CriteriaSetService,
    protected criteriaSetFormService: CriteriaSetFormService,
    protected actionService: ActionService,
    protected actionParameterValuesService: ActionParameterValuesService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAction = (o1: IAction | null, o2: IAction | null): boolean => this.actionService.compareAction(o1, o2);

  compareActionParameterValues = (o1: IActionParameterValues | null, o2: IActionParameterValues | null): boolean =>
    this.actionParameterValuesService.compareActionParameterValues(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaSet }) => {
      this.criteriaSet = criteriaSet;
      if (criteriaSet) {
        this.updateForm(criteriaSet);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteriaSet = this.criteriaSetFormService.getCriteriaSet(this.editForm);
    if (criteriaSet.id !== null) {
      this.subscribeToSaveResponse(this.criteriaSetService.update(criteriaSet));
    } else {
      this.subscribeToSaveResponse(this.criteriaSetService.create(criteriaSet));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteriaSet>>): void {
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

  protected updateForm(criteriaSet: ICriteriaSet): void {
    this.criteriaSet = criteriaSet;
    this.criteriaSetFormService.resetForm(this.editForm, criteriaSet);

    this.actionsSharedCollection = this.actionService.addActionToCollectionIfMissing<IAction>(
      this.actionsSharedCollection,
      criteriaSet.positiveAction,
      criteriaSet.negativeAction
    );
    this.actionParameterValuesSharedCollection =
      this.actionParameterValuesService.addActionParameterValuesToCollectionIfMissing<IActionParameterValues>(
        this.actionParameterValuesSharedCollection,
        criteriaSet.positiveActionParameters,
        criteriaSet.negativeActionParameters
      );
  }

  protected loadRelationshipsOptions(): void {
    this.actionService
      .query()
      .pipe(map((res: HttpResponse<IAction[]>) => res.body ?? []))
      .pipe(
        map((actions: IAction[]) =>
          this.actionService.addActionToCollectionIfMissing<IAction>(
            actions,
            this.criteriaSet?.positiveAction,
            this.criteriaSet?.negativeAction
          )
        )
      )
      .subscribe((actions: IAction[]) => (this.actionsSharedCollection = actions));

    this.actionParameterValuesService
      .query()
      .pipe(map((res: HttpResponse<IActionParameterValues[]>) => res.body ?? []))
      .pipe(
        map((actionParameterValues: IActionParameterValues[]) =>
          this.actionParameterValuesService.addActionParameterValuesToCollectionIfMissing<IActionParameterValues>(
            actionParameterValues,
            this.criteriaSet?.positiveActionParameters,
            this.criteriaSet?.negativeActionParameters
          )
        )
      )
      .subscribe((actionParameterValues: IActionParameterValues[]) => (this.actionParameterValuesSharedCollection = actionParameterValues));
  }
}
