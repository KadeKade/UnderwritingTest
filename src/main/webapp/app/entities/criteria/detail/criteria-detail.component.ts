import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICriteria } from '../criteria.model';

@Component({
  selector: 'jhi-criteria-detail',
  templateUrl: './criteria-detail.component.html',
})
export class CriteriaDetailComponent implements OnInit {
  criteria: ICriteria | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteria }) => {
      this.criteria = criteria;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
