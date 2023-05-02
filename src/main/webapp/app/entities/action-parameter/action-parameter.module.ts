import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActionParameterComponent } from './list/action-parameter.component';
import { ActionParameterDetailComponent } from './detail/action-parameter-detail.component';
import { ActionParameterUpdateComponent } from './update/action-parameter-update.component';
import { ActionParameterDeleteDialogComponent } from './delete/action-parameter-delete-dialog.component';
import { ActionParameterRoutingModule } from './route/action-parameter-routing.module';

@NgModule({
  imports: [SharedModule, ActionParameterRoutingModule],
  declarations: [
    ActionParameterComponent,
    ActionParameterDetailComponent,
    ActionParameterUpdateComponent,
    ActionParameterDeleteDialogComponent,
  ],
})
export class ActionParameterModule {}
