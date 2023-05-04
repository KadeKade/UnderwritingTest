import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBrokerCategory } from '../broker-category.model';
import { BrokerCategoryService } from '../service/broker-category.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './broker-category-delete-dialog.component.html',
})
export class BrokerCategoryDeleteDialogComponent {
  brokerCategory?: IBrokerCategory;

  constructor(protected brokerCategoryService: BrokerCategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.brokerCategoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
