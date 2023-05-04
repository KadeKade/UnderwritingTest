import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActionParameter } from '../action-parameter.model';
import { ActionParameterService } from '../service/action-parameter.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './action-parameter-delete-dialog.component.html',
})
export class ActionParameterDeleteDialogComponent {
  actionParameter?: IActionParameter;

  constructor(protected actionParameterService: ActionParameterService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.actionParameterService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
