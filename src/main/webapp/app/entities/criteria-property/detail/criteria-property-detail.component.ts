import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICriteriaProperty } from '../criteria-property.model';

@Component({
  selector: 'jhi-criteria-property-detail',
  templateUrl: './criteria-property-detail.component.html',
})
export class CriteriaPropertyDetailComponent implements OnInit {
  criteriaProperty: ICriteriaProperty | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaProperty }) => {
      this.criteriaProperty = criteriaProperty;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
