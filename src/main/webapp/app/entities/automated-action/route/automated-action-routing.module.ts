import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AutomatedActionComponent } from '../list/automated-action.component';
import { AutomatedActionDetailComponent } from '../detail/automated-action-detail.component';
import { AutomatedActionUpdateComponent } from '../update/automated-action-update.component';
import { AutomatedActionRoutingResolveService } from './automated-action-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const automatedActionRoute: Routes = [
  {
    path: '',
    component: AutomatedActionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AutomatedActionDetailComponent,
    resolve: {
      automatedAction: AutomatedActionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AutomatedActionUpdateComponent,
    resolve: {
      automatedAction: AutomatedActionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AutomatedActionUpdateComponent,
    resolve: {
      automatedAction: AutomatedActionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(automatedActionRoute)],
  exports: [RouterModule],
})
export class AutomatedActionRoutingModule {}
