import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActionParameterFormService, ActionParameterFormGroup } from './action-parameter-form.service';
import { IActionParameter } from '../action-parameter.model';
import { ActionParameterService } from '../service/action-parameter.service';
import { IAutomatedAction } from 'app/entities/automated-action/automated-action.model';
import { AutomatedActionService } from 'app/entities/automated-action/service/automated-action.service';

@Component({
  selector: 'jhi-action-parameter-update',
  templateUrl: './action-parameter-update.component.html',
})
export class ActionParameterUpdateComponent implements OnInit {
  isSaving = false;
  actionParameter: IActionParameter | null = null;

  automatedActionsSharedCollection: IAutomatedAction[] = [];

  editForm: ActionParameterFormGroup = this.actionParameterFormService.createActionParameterFormGroup();

  constructor(
    protected actionParameterService: ActionParameterService,
    protected actionParameterFormService: ActionParameterFormService,
    protected automatedActionService: AutomatedActionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAutomatedAction = (o1: IAutomatedAction | null, o2: IAutomatedAction | null): boolean =>
    this.automatedActionService.compareAutomatedAction(o1, o2);

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

    this.automatedActionsSharedCollection = this.automatedActionService.addAutomatedActionToCollectionIfMissing<IAutomatedAction>(
      this.automatedActionsSharedCollection,
      actionParameter.positiveAutomatedActions,
      actionParameter.negativeAutomatedActions
    );
  }

  protected loadRelationshipsOptions(): void {
    this.automatedActionService
      .query()
      .pipe(map((res: HttpResponse<IAutomatedAction[]>) => res.body ?? []))
      .pipe(
        map((automatedActions: IAutomatedAction[]) =>
          this.automatedActionService.addAutomatedActionToCollectionIfMissing<IAutomatedAction>(
            automatedActions,
            this.actionParameter?.positiveAutomatedActions,
            this.actionParameter?.negativeAutomatedActions
          )
        )
      )
      .subscribe((automatedActions: IAutomatedAction[]) => (this.automatedActionsSharedCollection = automatedActions));
  }
}
