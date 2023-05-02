import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAutomatedAction } from '../automated-action.model';

@Component({
  selector: 'jhi-automated-action-detail',
  templateUrl: './automated-action-detail.component.html',
})
export class AutomatedActionDetailComponent implements OnInit {
  automatedAction: IAutomatedAction | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ automatedAction }) => {
      this.automatedAction = automatedAction;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
