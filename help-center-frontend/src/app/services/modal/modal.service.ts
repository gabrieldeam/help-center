import { Injectable, ComponentRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef: NgbModalRef | undefined;

  constructor(private modalService: NgbModal) {}

  openCreateModal(component: any): NgbModalRef {
    this.modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    return this.modalRef;
  }

  closeCreateModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}