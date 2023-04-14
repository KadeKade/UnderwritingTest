import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CriteriaProperyFormService, CriteriaProperyFormGroup } from './criteria-propery-form.service';
import { ICriteriaPropery } from '../criteria-propery.model';
import { CriteriaProperyService } from '../service/criteria-propery.service';

@Component({
  selector: 'jhi-criteria-propery-update',
  templateUrl: './criteria-propery-update.component.html',
})
export class CriteriaProperyUpdateComponent implements OnInit {
  isSaving = false;
  criteriaPropery: ICriteriaPropery | null = null;

  editForm: CriteriaProperyFormGroup = this.criteriaProperyFormService.createCriteriaProperyFormGroup();

  constructor(
    protected criteriaProperyService: CriteriaProperyService,
    protected criteriaProperyFormService: CriteriaProperyFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaPropery }) => {
      this.criteriaPropery = criteriaPropery;
      if (criteriaPropery) {
        this.updateForm(criteriaPropery);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteriaPropery = this.criteriaProperyFormService.getCriteriaPropery(this.editForm);
    if (criteriaPropery.id !== null) {
      this.subscribeToSaveResponse(this.criteriaProperyService.update(criteriaPropery));
    } else {
      this.subscribeToSaveResponse(this.criteriaProperyService.create(criteriaPropery));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteriaPropery>>): void {
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

  protected updateForm(criteriaPropery: ICriteriaPropery): void {
    this.criteriaPropery = criteriaPropery;
    this.criteriaProperyFormService.resetForm(this.editForm, criteriaPropery);
  }
}
