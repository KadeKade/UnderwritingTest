import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActionParameterComponent } from '../list/action-parameter.component';
import { ActionParameterDetailComponent } from '../detail/action-parameter-detail.component';
import { ActionParameterUpdateComponent } from '../update/action-parameter-update.component';
import { ActionParameterRoutingResolveService } from './action-parameter-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const actionParameterRoute: Routes = [
  {
    path: '',
    component: ActionParameterComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActionParameterDetailComponent,
    resolve: {
      actionParameter: ActionParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActionParameterUpdateComponent,
    resolve: {
      actionParameter: ActionParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActionParameterUpdateComponent,
    resolve: {
      actionParameter: ActionParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(actionParameterRoute)],
  exports: [RouterModule],
})
export class ActionParameterRoutingModule {}
