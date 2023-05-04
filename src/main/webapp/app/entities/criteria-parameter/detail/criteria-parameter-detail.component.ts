import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICriteriaParameter } from '../criteria-parameter.model';

@Component({
  selector: 'jhi-criteria-parameter-detail',
  templateUrl: './criteria-parameter-detail.component.html',
})
export class CriteriaParameterDetailComponent implements OnInit {
  criteriaParameter: ICriteriaParameter | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaParameter }) => {
      this.criteriaParameter = criteriaParameter;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
