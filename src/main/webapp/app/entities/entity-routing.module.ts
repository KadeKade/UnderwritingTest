import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'automated-action',
        data: { pageTitle: 'AutomatedActions' },
        loadChildren: () => import('./automated-action/automated-action.module').then(m => m.AutomatedActionModule),
      },
      {
        path: 'action-parameter',
        data: { pageTitle: 'ActionParameters' },
        loadChildren: () => import('./action-parameter/action-parameter.module').then(m => m.ActionParameterModule),
      },
      {
        path: 'broker-category',
        data: { pageTitle: 'BrokerCategories' },
        loadChildren: () => import('./broker-category/broker-category.module').then(m => m.BrokerCategoryModule),
      },
      {
        path: 'criteria-set',
        data: { pageTitle: 'CriteriaSets' },
        loadChildren: () => import('./criteria-set/criteria-set.module').then(m => m.CriteriaSetModule),
      },
      {
        path: 'criteria',
        data: { pageTitle: 'Criteria' },
        loadChildren: () => import('./criteria/criteria.module').then(m => m.CriteriaModule),
      },
      {
        path: 'criteria-parameter',
        data: { pageTitle: 'CriteriaParameters' },
        loadChildren: () => import('./criteria-parameter/criteria-parameter.module').then(m => m.CriteriaParameterModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
