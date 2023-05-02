import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ParameterFormService, ParameterFormGroup } from './parameter-form.service';
import { IParameter } from '../parameter.model';
import { ParameterService } from '../service/parameter.service';

@Component({
  selector: 'jhi-parameter-update',
  templateUrl: './parameter-update.component.html',
})
export class ParameterUpdateComponent implements OnInit {
  isSaving = false;
  parameter: IParameter | null = null;

  editForm: ParameterFormGroup = this.parameterFormService.createParameterFormGroup();

  constructor(
    protected parameterService: ParameterService,
    protected parameterFormService: ParameterFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parameter }) => {
      this.parameter = parameter;
      if (parameter) {
        this.updateForm(parameter);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parameter = this.parameterFormService.getParameter(this.editForm);
    if (parameter.id !== null) {
      this.subscribeToSaveResponse(this.parameterService.update(parameter));
    } else {
      this.subscribeToSaveResponse(this.parameterService.create(parameter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParameter>>): void {
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

  protected updateForm(parameter: IParameter): void {
    this.parameter = parameter;
    this.parameterFormService.resetForm(this.editForm, parameter);
  }
}
