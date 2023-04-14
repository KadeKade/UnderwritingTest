import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActionParametersComponent } from './list/action-parameters.component';
import { ActionParametersDetailComponent } from './detail/action-parameters-detail.component';
import { ActionParametersUpdateComponent } from './update/action-parameters-update.component';
import { ActionParametersDeleteDialogComponent } from './delete/action-parameters-delete-dialog.component';
import { ActionParametersRoutingModule } from './route/action-parameters-routing.module';

@NgModule({
  imports: [SharedModule, ActionParametersRoutingModule],
  declarations: [
    ActionParametersComponent,
    ActionParametersDetailComponent,
    ActionParametersUpdateComponent,
    ActionParametersDeleteDialogComponent,
  ],
})
export class ActionParametersModule {}
