import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAutomatedAction } from '../automated-action.model';
import { AutomatedActionService } from '../service/automated-action.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './automated-action-delete-dialog.component.html',
})
export class AutomatedActionDeleteDialogComponent {
  automatedAction?: IAutomatedAction;

  constructor(protected automatedActionService: AutomatedActionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.automatedActionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
