import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActionParameterValuesFormService, ActionParameterValuesFormGroup } from './action-parameter-values-form.service';
import { IActionParameterValues } from '../action-parameter-values.model';
import { ActionParameterValuesService } from '../service/action-parameter-values.service';
import { IActionParameters } from 'app/entities/action-parameters/action-parameters.model';
import { ActionParametersService } from 'app/entities/action-parameters/service/action-parameters.service';

@Component({
  selector: 'jhi-action-parameter-values-update',
  templateUrl: './action-parameter-values-update.component.html',
})
export class ActionParameterValuesUpdateComponent implements OnInit {
  isSaving = false;
  actionParameterValues: IActionParameterValues | null = null;

  actionParametersSharedCollection: IActionParameters[] = [];

  editForm: ActionParameterValuesFormGroup = this.actionParameterValuesFormService.createActionParameterValuesFormGroup();

  constructor(
    protected actionParameterValuesService: ActionParameterValuesService,
    protected actionParameterValuesFormService: ActionParameterValuesFormService,
    protected actionParametersService: ActionParametersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareActionParameters = (o1: IActionParameters | null, o2: IActionParameters | null): boolean =>
    this.actionParametersService.compareActionParameters(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionParameterValues }) => {
      this.actionParameterValues = actionParameterValues;
      if (actionParameterValues) {
        this.updateForm(actionParameterValues);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actionParameterValues = this.actionParameterValuesFormService.getActionParameterValues(this.editForm);
    if (actionParameterValues.id !== null) {
      this.subscribeToSaveResponse(this.actionParameterValuesService.update(actionParameterValues));
    } else {
      this.subscribeToSaveResponse(this.actionParameterValuesService.create(actionParameterValues));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActionParameterValues>>): void {
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

  protected updateForm(actionParameterValues: IActionParameterValues): void {
    this.actionParameterValues = actionParameterValues;
    this.actionParameterValuesFormService.resetForm(this.editForm, actionParameterValues);

    this.actionParametersSharedCollection = this.actionParametersService.addActionParametersToCollectionIfMissing<IActionParameters>(
      this.actionParametersSharedCollection,
      actionParameterValues.parameter
    );
  }

  protected loadRelationshipsOptions(): void {
    this.actionParametersService
      .query()
      .pipe(map((res: HttpResponse<IActionParameters[]>) => res.body ?? []))
      .pipe(
        map((actionParameters: IActionParameters[]) =>
          this.actionParametersService.addActionParametersToCollectionIfMissing<IActionParameters>(
            actionParameters,
            this.actionParameterValues?.parameter
          )
        )
      )
      .subscribe((actionParameters: IActionParameters[]) => (this.actionParametersSharedCollection = actionParameters));
  }
}
