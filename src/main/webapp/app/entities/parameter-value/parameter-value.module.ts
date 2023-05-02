import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParameterValueComponent } from './list/parameter-value.component';
import { ParameterValueDetailComponent } from './detail/parameter-value-detail.component';
import { ParameterValueUpdateComponent } from './update/parameter-value-update.component';
import { ParameterValueDeleteDialogComponent } from './delete/parameter-value-delete-dialog.component';
import { ParameterValueRoutingModule } from './route/parameter-value-routing.module';

@NgModule({
  imports: [SharedModule, ParameterValueRoutingModule],
  declarations: [
    ParameterValueComponent,
    ParameterValueDetailComponent,
    ParameterValueUpdateComponent,
    ParameterValueDeleteDialogComponent,
  ],
})
export class ParameterValueModule {}
