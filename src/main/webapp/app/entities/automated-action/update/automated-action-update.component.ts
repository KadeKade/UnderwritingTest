import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AutomatedActionFormService, AutomatedActionFormGroup } from './automated-action-form.service';
import { IAutomatedAction } from '../automated-action.model';
import { AutomatedActionService } from '../service/automated-action.service';
import { AutomatedActionType } from 'app/entities/enumerations/automated-action-type.model';

@Component({
  selector: 'jhi-automated-action-update',
  templateUrl: './automated-action-update.component.html',
})
export class AutomatedActionUpdateComponent implements OnInit {
  isSaving = false;
  automatedAction: IAutomatedAction | null = null;
  automatedActionTypeValues = Object.keys(AutomatedActionType);

  editForm: AutomatedActionFormGroup = this.automatedActionFormService.createAutomatedActionFormGroup();

  constructor(
    protected automatedActionService: AutomatedActionService,
    protected automatedActionFormService: AutomatedActionFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ automatedAction }) => {
      this.automatedAction = automatedAction;
      if (automatedAction) {
        this.updateForm(automatedAction);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const automatedAction = this.automatedActionFormService.getAutomatedAction(this.editForm);
    if (automatedAction.id !== null) {
      this.subscribeToSaveResponse(this.automatedActionService.update(automatedAction));
    } else {
      this.subscribeToSaveResponse(this.automatedActionService.create(automatedAction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAutomatedAction>>): void {
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

  protected updateForm(automatedAction: IAutomatedAction): void {
    this.automatedAction = automatedAction;
    this.automatedActionFormService.resetForm(this.editForm, automatedAction);
  }
}
