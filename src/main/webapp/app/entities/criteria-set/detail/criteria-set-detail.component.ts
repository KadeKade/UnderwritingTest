import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICriteriaSet } from '../criteria-set.model';

@Component({
  selector: 'jhi-criteria-set-detail',
  templateUrl: './criteria-set-detail.component.html',
})
export class CriteriaSetDetailComponent implements OnInit {
  criteriaSet: ICriteriaSet | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaSet }) => {
      this.criteriaSet = criteriaSet;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
