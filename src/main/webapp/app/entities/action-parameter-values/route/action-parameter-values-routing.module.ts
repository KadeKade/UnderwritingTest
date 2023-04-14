import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActionParameterValuesComponent } from '../list/action-parameter-values.component';
import { ActionParameterValuesDetailComponent } from '../detail/action-parameter-values-detail.component';
import { ActionParameterValuesUpdateComponent } from '../update/action-parameter-values-update.component';
import { ActionParameterValuesRoutingResolveService } from './action-parameter-values-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const actionParameterValuesRoute: Routes = [
  {
    path: '',
    component: ActionParameterValuesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActionParameterValuesDetailComponent,
    resolve: {
      actionParameterValues: ActionParameterValuesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActionParameterValuesUpdateComponent,
    resolve: {
      actionParameterValues: ActionParameterValuesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActionParameterValuesUpdateComponent,
    resolve: {
      actionParameterValues: ActionParameterValuesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(actionParameterValuesRoute)],
  exports: [RouterModule],
})
export class ActionParameterValuesRoutingModule {}
