import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICriteriaProperty } from '../criteria-property.model';
import { CriteriaPropertyService } from '../service/criteria-property.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './criteria-property-delete-dialog.component.html',
})
export class CriteriaPropertyDeleteDialogComponent {
  criteriaProperty?: ICriteriaProperty;

  constructor(protected criteriaPropertyService: CriteriaPropertyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.criteriaPropertyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
