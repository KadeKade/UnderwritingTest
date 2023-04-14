import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CriteriaFormService, CriteriaFormGroup } from './criteria-form.service';
import { ICriteria } from '../criteria.model';
import { CriteriaService } from '../service/criteria.service';
import { ICriteriaPropery } from 'app/entities/criteria-propery/criteria-propery.model';
import { CriteriaProperyService } from 'app/entities/criteria-propery/service/criteria-propery.service';
import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';
import { CriteriaSetService } from 'app/entities/criteria-set/service/criteria-set.service';
import { Operator } from 'app/entities/enumerations/operator.model';

@Component({
  selector: 'jhi-criteria-update',
  templateUrl: './criteria-update.component.html',
})
export class CriteriaUpdateComponent implements OnInit {
  isSaving = false;
  criteria: ICriteria | null = null;
  operatorValues = Object.keys(Operator);

  criteriaProperiesSharedCollection: ICriteriaPropery[] = [];
  criteriaSetsSharedCollection: ICriteriaSet[] = [];

  editForm: CriteriaFormGroup = this.criteriaFormService.createCriteriaFormGroup();

  constructor(
    protected criteriaService: CriteriaService,
    protected criteriaFormService: CriteriaFormService,
    protected criteriaProperyService: CriteriaProperyService,
    protected criteriaSetService: CriteriaSetService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCriteriaPropery = (o1: ICriteriaPropery | null, o2: ICriteriaPropery | null): boolean =>
    this.criteriaProperyService.compareCriteriaPropery(o1, o2);

  compareCriteriaSet = (o1: ICriteriaSet | null, o2: ICriteriaSet | null): boolean => this.criteriaSetService.compareCriteriaSet(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteria }) => {
      this.criteria = criteria;
      if (criteria) {
        this.updateForm(criteria);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteria = this.criteriaFormService.getCriteria(this.editForm);
    if (criteria.id !== null) {
      this.subscribeToSaveResponse(this.criteriaService.update(criteria));
    } else {
      this.subscribeToSaveResponse(this.criteriaService.create(criteria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteria>>): void {
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

  protected updateForm(criteria: ICriteria): void {
    this.criteria = criteria;
    this.criteriaFormService.resetForm(this.editForm, criteria);

    this.criteriaProperiesSharedCollection = this.criteriaProperyService.addCriteriaProperyToCollectionIfMissing<ICriteriaPropery>(
      this.criteriaProperiesSharedCollection,
      criteria.property
    );
    this.criteriaSetsSharedCollection = this.criteriaSetService.addCriteriaSetToCollectionIfMissing<ICriteriaSet>(
      this.criteriaSetsSharedCollection,
      criteria.criteria
    );
  }

  protected loadRelationshipsOptions(): void {
    this.criteriaProperyService
      .query()
      .pipe(map((res: HttpResponse<ICriteriaPropery[]>) => res.body ?? []))
      .pipe(
        map((criteriaProperies: ICriteriaPropery[]) =>
          this.criteriaProperyService.addCriteriaProperyToCollectionIfMissing<ICriteriaPropery>(criteriaProperies, this.criteria?.property)
        )
      )
      .subscribe((criteriaProperies: ICriteriaPropery[]) => (this.criteriaProperiesSharedCollection = criteriaProperies));

    this.criteriaSetService
      .query()
      .pipe(map((res: HttpResponse<ICriteriaSet[]>) => res.body ?? []))
      .pipe(
        map((criteriaSets: ICriteriaSet[]) =>
          this.criteriaSetService.addCriteriaSetToCollectionIfMissing<ICriteriaSet>(criteriaSets, this.criteria?.criteria)
        )
      )
      .subscribe((criteriaSets: ICriteriaSet[]) => (this.criteriaSetsSharedCollection = criteriaSets));
  }
}
