import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParameterValue } from '../parameter-value.model';

@Component({
  selector: 'jhi-parameter-value-detail',
  templateUrl: './parameter-value-detail.component.html',
})
export class ParameterValueDetailComponent implements OnInit {
  parameterValue: IParameterValue | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parameterValue }) => {
      this.parameterValue = parameterValue;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
