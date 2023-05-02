import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CriteriaPropertyFormService, CriteriaPropertyFormGroup } from './criteria-property-form.service';
import { ICriteriaProperty } from '../criteria-property.model';
import { CriteriaPropertyService } from '../service/criteria-property.service';
import { ICriteria } from 'app/entities/criteria/criteria.model';
import { CriteriaService } from 'app/entities/criteria/service/criteria.service';
import { DataType } from 'app/entities/enumerations/data-type.model';

@Component({
  selector: 'jhi-criteria-property-update',
  templateUrl: './criteria-property-update.component.html',
})
export class CriteriaPropertyUpdateComponent implements OnInit {
  isSaving = false;
  criteriaProperty: ICriteriaProperty | null = null;
  dataTypeValues = Object.keys(DataType);

  criteriaSharedCollection: ICriteria[] = [];

  editForm: CriteriaPropertyFormGroup = this.criteriaPropertyFormService.createCriteriaPropertyFormGroup();

  constructor(
    protected criteriaPropertyService: CriteriaPropertyService,
    protected criteriaPropertyFormService: CriteriaPropertyFormService,
    protected criteriaService: CriteriaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCriteria = (o1: ICriteria | null, o2: ICriteria | null): boolean => this.criteriaService.compareCriteria(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaProperty }) => {
      this.criteriaProperty = criteriaProperty;
      if (criteriaProperty) {
        this.updateForm(criteriaProperty);
      }

      this.loadRelationshipsOptions();
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

    this.criteriaSharedCollection = this.criteriaService.addCriteriaToCollectionIfMissing<ICriteria>(
      this.criteriaSharedCollection,
      criteriaProperty.property
    );
  }

  protected loadRelationshipsOptions(): void {
    this.criteriaService
      .query()
      .pipe(map((res: HttpResponse<ICriteria[]>) => res.body ?? []))
      .pipe(
        map((criteria: ICriteria[]) =>
          this.criteriaService.addCriteriaToCollectionIfMissing<ICriteria>(criteria, this.criteriaProperty?.property)
        )
      )
      .subscribe((criteria: ICriteria[]) => (this.criteriaSharedCollection = criteria));
  }
}
