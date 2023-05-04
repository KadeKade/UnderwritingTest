import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CriteriaSetFormService, CriteriaSetFormGroup } from './criteria-set-form.service';
import { ICriteriaSet } from '../criteria-set.model';
import { CriteriaSetService } from '../service/criteria-set.service';
import { IAutomatedAction } from 'app/entities/automated-action/automated-action.model';
import { AutomatedActionService } from 'app/entities/automated-action/service/automated-action.service';
import { IBrokerCategory } from 'app/entities/broker-category/broker-category.model';
import { BrokerCategoryService } from 'app/entities/broker-category/service/broker-category.service';

@Component({
  selector: 'jhi-criteria-set-update',
  templateUrl: './criteria-set-update.component.html',
})
export class CriteriaSetUpdateComponent implements OnInit {
  isSaving = false;
  criteriaSet: ICriteriaSet | null = null;

  automatedActionsSharedCollection: IAutomatedAction[] = [];
  brokerCategoriesSharedCollection: IBrokerCategory[] = [];

  editForm: CriteriaSetFormGroup = this.criteriaSetFormService.createCriteriaSetFormGroup();

  constructor(
    protected criteriaSetService: CriteriaSetService,
    protected criteriaSetFormService: CriteriaSetFormService,
    protected automatedActionService: AutomatedActionService,
    protected brokerCategoryService: BrokerCategoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAutomatedAction = (o1: IAutomatedAction | null, o2: IAutomatedAction | null): boolean =>
    this.automatedActionService.compareAutomatedAction(o1, o2);

  compareBrokerCategory = (o1: IBrokerCategory | null, o2: IBrokerCategory | null): boolean =>
    this.brokerCategoryService.compareBrokerCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaSet }) => {
      this.criteriaSet = criteriaSet;
      if (criteriaSet) {
        this.updateForm(criteriaSet);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const criteriaSet = this.criteriaSetFormService.getCriteriaSet(this.editForm);
    if (criteriaSet.id !== null) {
      this.subscribeToSaveResponse(this.criteriaSetService.update(criteriaSet));
    } else {
      this.subscribeToSaveResponse(this.criteriaSetService.create(criteriaSet));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICriteriaSet>>): void {
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

  protected updateForm(criteriaSet: ICriteriaSet): void {
    this.criteriaSet = criteriaSet;
    this.criteriaSetFormService.resetForm(this.editForm, criteriaSet);

    this.automatedActionsSharedCollection = this.automatedActionService.addAutomatedActionToCollectionIfMissing<IAutomatedAction>(
      this.automatedActionsSharedCollection,
      criteriaSet.automatedAction
    );
    this.brokerCategoriesSharedCollection = this.brokerCategoryService.addBrokerCategoryToCollectionIfMissing<IBrokerCategory>(
      this.brokerCategoriesSharedCollection,
      ...(criteriaSet.brokerCategories ?? [])
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
            this.criteriaSet?.automatedAction
          )
        )
      )
      .subscribe((automatedActions: IAutomatedAction[]) => (this.automatedActionsSharedCollection = automatedActions));

    this.brokerCategoryService
      .query()
      .pipe(map((res: HttpResponse<IBrokerCategory[]>) => res.body ?? []))
      .pipe(
        map((brokerCategories: IBrokerCategory[]) =>
          this.brokerCategoryService.addBrokerCategoryToCollectionIfMissing<IBrokerCategory>(
            brokerCategories,
            ...(this.criteriaSet?.brokerCategories ?? [])
          )
        )
      )
      .subscribe((brokerCategories: IBrokerCategory[]) => (this.brokerCategoriesSharedCollection = brokerCategories));
  }
}
