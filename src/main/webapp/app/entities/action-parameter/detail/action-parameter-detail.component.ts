import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActionParameter } from '../action-parameter.model';

@Component({
  selector: 'jhi-action-parameter-detail',
  templateUrl: './action-parameter-detail.component.html',
})
export class ActionParameterDetailComponent implements OnInit {
  actionParameter: IActionParameter | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionParameter }) => {
      this.actionParameter = actionParameter;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
