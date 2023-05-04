import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBrokerCategory } from '../broker-category.model';

@Component({
  selector: 'jhi-broker-category-detail',
  templateUrl: './broker-category-detail.component.html',
})
export class BrokerCategoryDetailComponent implements OnInit {
  brokerCategory: IBrokerCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ brokerCategory }) => {
      this.brokerCategory = brokerCategory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
