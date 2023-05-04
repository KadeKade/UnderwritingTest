import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CriteriaFormService, CriteriaFormGroup } from './criteria-form.service';
import { ICriteria } from '../criteria.model';
import { CriteriaService } from '../service/criteria.service';
import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';
import { CriteriaSetService } from 'app/entities/criteria-set/service/criteria-set.service';
import { CriteriaType } from 'app/entities/enumerations/criteria-type.model';
import { Operator } from 'app/entities/enumerations/operator.model';
import { CriteriaDefinition } from 'app/entities/enumerations/criteria-definition.model';

@Component({
  selector: 'jhi-criteria-update',
  templateUrl: './criteria-update.component.html',
})
export class CriteriaUpdateComponent implements OnInit {
  isSaving = false;
  criteria: ICriteria | null = null;
  criteriaTypeValues = Object.keys(CriteriaType);
  operatorValues = Object.keys(Operator);
  criteriaDefinitionValues = Object.keys(CriteriaDefinition);

  criteriaSetsSharedCollection: ICriteriaSet[] = [];

  editForm: CriteriaFormGroup = this.criteriaFormService.createCriteriaFormGroup();

  constructor(
    protected criteriaService: CriteriaService,
    protected criteriaFormService: CriteriaFormService,
    protected criteriaSetService: CriteriaSetService,
    protected activatedRoute: ActivatedRoute
  ) {}

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

    this.criteriaSetsSharedCollection = this.criteriaSetService.addCriteriaSetToCollectionIfMissing<ICriteriaSet>(
      this.criteriaSetsSharedCollection,
      criteria.criteriaSet
    );
  }

  protected loadRelationshipsOptions(): void {
    this.criteriaSetService
      .query()
      .pipe(map((res: HttpResponse<ICriteriaSet[]>) => res.body ?? []))
      .pipe(
        map((criteriaSets: ICriteriaSet[]) =>
          this.criteriaSetService.addCriteriaSetToCollectionIfMissing<ICriteriaSet>(criteriaSets, this.criteria?.criteriaSet)
        )
      )
      .subscribe((criteriaSets: ICriteriaSet[]) => (this.criteriaSetsSharedCollection = criteriaSets));
  }
}
