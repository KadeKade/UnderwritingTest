import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CriteriaPropertyFormService, CriteriaPropertyFormGroup } from './criteria-property-form.service';
import { ICriteriaProperty } from '../criteria-property.model';
import { CriteriaPropertyService } from '../service/criteria-property.service';
import { DataType } from 'app/entities/enumerations/data-type.model';

@Component({
  selector: 'jhi-criteria-property-update',
  templateUrl: './criteria-property-update.component.html',
})
export class CriteriaPropertyUpdateComponent implements OnInit {
  isSaving = false;
  criteriaProperty: ICriteriaProperty | null = null;
  dataTypeValues = Object.keys(DataType);

  editForm: CriteriaPropertyFormGroup = this.criteriaPropertyFormService.createCriteriaPropertyFormGroup();

  constructor(
    protected criteriaPropertyService: CriteriaPropertyService,
    protected criteriaPropertyFormService: CriteriaPropertyFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaProperty }) => {
      this.criteriaProperty = criteriaProperty;
      if (criteriaProperty) {
        this.updateForm(criteriaProperty);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteriaProperty = this.criteriaPropertyFormService.getCriteriaProperty(this.editForm);
    if (criteriaProperty.id !== null) {
      this.subscribeToSaveResponse(this.criteriaPropertyService.update(criteriaProperty));
    } else {
      this.subscribeToSaveResponse(this.criteriaPropertyService.create(criteriaProperty));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteriaProperty>>): void {
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

  protected updateForm(criteriaProperty: ICriteriaProperty): void {
    this.criteriaProperty = criteriaProperty;
    this.criteriaPropertyFormService.resetForm(this.editForm, criteriaProperty);
  }
}
