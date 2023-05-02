import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActionParameters } from '../action-parameters.model';
import { ActionParametersService } from '../service/action-parameters.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './action-parameters-delete-dialog.component.html',
})
export class ActionParametersDeleteDialogComponent {
  actionParameters?: IActionParameters;

  constructor(protected actionParametersService: ActionParametersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.actionParametersService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
