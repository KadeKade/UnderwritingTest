import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActionParameterValues } from '../action-parameter-values.model';

@Component({
  selector: 'jhi-action-parameter-values-detail',
  templateUrl: './action-parameter-values-detail.component.html',
})
export class ActionParameterValuesDetailComponent implements OnInit {
  actionParameterValues: IActionParameterValues | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionParameterValues }) => {
      this.actionParameterValues = actionParameterValues;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
