import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ActionParametersFormService, ActionParametersFormGroup } from './action-parameters-form.service';
import { IActionParameters } from '../action-parameters.model';
import { ActionParametersService } from '../service/action-parameters.service';

@Component({
  selector: 'jhi-action-parameters-update',
  templateUrl: './action-parameters-update.component.html',
})
export class ActionParametersUpdateComponent implements OnInit {
  isSaving = false;
  actionParameters: IActionParameters | null = null;

  editForm: ActionParametersFormGroup = this.actionParametersFormService.createActionParametersFormGroup();

  constructor(
    protected actionParametersService: ActionParametersService,
    protected actionParametersFormService: ActionParametersFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionParameters }) => {
      this.actionParameters = actionParameters;
      if (actionParameters) {
        this.updateForm(actionParameters);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actionParameters = this.actionParametersFormService.getActionParameters(this.editForm);
    if (actionParameters.id !== null) {
      this.subscribeToSaveResponse(this.actionParametersService.update(actionParameters));
    } else {
      this.subscribeToSaveResponse(this.actionParametersService.create(actionParameters));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActionParameters>>): void {
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

  protected updateForm(actionParameters: IActionParameters): void {
    this.actionParameters = actionParameters;
    this.actionParametersFormService.resetForm(this.editForm, actionParameters);
  }
}
