import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActionParameters } from '../action-parameters.model';

@Component({
  selector: 'jhi-action-parameters-detail',
  templateUrl: './action-parameters-detail.component.html',
})
export class ActionParametersDetailComponent implements OnInit {
  actionParameters: IActionParameters | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionParameters }) => {
      this.actionParameters = actionParameters;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
