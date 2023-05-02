import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AutomatedActionComponent } from './list/automated-action.component';
import { AutomatedActionDetailComponent } from './detail/automated-action-detail.component';
import { AutomatedActionUpdateComponent } from './update/automated-action-update.component';
import { AutomatedActionDeleteDialogComponent } from './delete/automated-action-delete-dialog.component';
import { AutomatedActionRoutingModule } from './route/automated-action-routing.module';

@NgModule({
  imports: [SharedModule, AutomatedActionRoutingModule],
  declarations: [
    AutomatedActionComponent,
    AutomatedActionDetailComponent,
    AutomatedActionUpdateComponent,
    AutomatedActionDeleteDialogComponent,
  ],
})
export class AutomatedActionModule {}
