import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BrokerCategoryComponent } from './list/broker-category.component';
import { BrokerCategoryDetailComponent } from './detail/broker-category-detail.component';
import { BrokerCategoryUpdateComponent } from './update/broker-category-update.component';
import { BrokerCategoryDeleteDialogComponent } from './delete/broker-category-delete-dialog.component';
import { BrokerCategoryRoutingModule } from './route/broker-category-routing.module';

@NgModule({
  imports: [SharedModule, BrokerCategoryRoutingModule],
  declarations: [
    BrokerCategoryComponent,
    BrokerCategoryDetailComponent,
    BrokerCategoryUpdateComponent,
    BrokerCategoryDeleteDialogComponent,
  ],
})
export class BrokerCategoryModule {}
