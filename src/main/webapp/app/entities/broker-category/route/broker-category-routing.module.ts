import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BrokerCategoryComponent } from '../list/broker-category.component';
import { BrokerCategoryDetailComponent } from '../detail/broker-category-detail.component';
import { BrokerCategoryUpdateComponent } from '../update/broker-category-update.component';
import { BrokerCategoryRoutingResolveService } from './broker-category-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const brokerCategoryRoute: Routes = [
  {
    path: '',
    component: BrokerCategoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BrokerCategoryDetailComponent,
    resolve: {
      brokerCategory: BrokerCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BrokerCategoryUpdateComponent,
    resolve: {
      brokerCategory: BrokerCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BrokerCategoryUpdateComponent,
    resolve: {
      brokerCategory: BrokerCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(brokerCategoryRoute)],
  exports: [RouterModule],
})
export class BrokerCategoryRoutingModule {}
