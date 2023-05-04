import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BrokerCategoryFormService, BrokerCategoryFormGroup } from './broker-category-form.service';
import { IBrokerCategory } from '../broker-category.model';
import { BrokerCategoryService } from '../service/broker-category.service';

@Component({
  selector: 'jhi-broker-category-update',
  templateUrl: './broker-category-update.component.html',
})
export class BrokerCategoryUpdateComponent implements OnInit {
  isSaving = false;
  brokerCategory: IBrokerCategory | null = null;

  editForm: BrokerCategoryFormGroup = this.brokerCategoryFormService.createBrokerCategoryFormGroup();

  constructor(
    protected brokerCategoryService: BrokerCategoryService,
    protected brokerCategoryFormService: BrokerCategoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ brokerCategory }) => {
      this.brokerCategory = brokerCategory;
      if (brokerCategory) {
        this.updateForm(brokerCategory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const brokerCategory = this.brokerCategoryFormService.getBrokerCategory(this.editForm);
    if (brokerCategory.id !== null) {
      this.subscribeToSaveResponse(this.brokerCategoryService.update(brokerCategory));
    } else {
      this.subscribeToSaveResponse(this.brokerCategoryService.create(brokerCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBrokerCategory>>): void {
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

  protected updateForm(brokerCategory: IBrokerCategory): void {
    this.brokerCategory = brokerCategory;
    this.brokerCategoryFormService.resetForm(this.editForm, brokerCategory);
  }
}
