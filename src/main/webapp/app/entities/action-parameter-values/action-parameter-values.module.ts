import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActionParameterValuesComponent } from './list/action-parameter-values.component';
import { ActionParameterValuesDetailComponent } from './detail/action-parameter-values-detail.component';
import { ActionParameterValuesUpdateComponent } from './update/action-parameter-values-update.component';
import { ActionParameterValuesDeleteDialogComponent } from './delete/action-parameter-values-delete-dialog.component';
import { ActionParameterValuesRoutingModule } from './route/action-parameter-values-routing.module';

@NgModule({
  imports: [SharedModule, ActionParameterValuesRoutingModule],
  declarations: [
    ActionParameterValuesComponent,
    ActionParameterValuesDetailComponent,
    ActionParameterValuesUpdateComponent,
    ActionParameterValuesDeleteDialogComponent,
  ],
})
export class ActionParameterValuesModule {}
