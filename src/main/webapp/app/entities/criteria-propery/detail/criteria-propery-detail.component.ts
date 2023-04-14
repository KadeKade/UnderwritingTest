import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICriteriaPropery } from '../criteria-propery.model';

@Component({
  selector: 'jhi-criteria-propery-detail',
  templateUrl: './criteria-propery-detail.component.html',
})
export class CriteriaProperyDetailComponent implements OnInit {
  criteriaPropery: ICriteriaPropery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ criteriaPropery }) => {
      this.criteriaPropery = criteriaPropery;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
