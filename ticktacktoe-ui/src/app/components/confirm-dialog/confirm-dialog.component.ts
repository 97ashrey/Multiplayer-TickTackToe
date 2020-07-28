import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {

  public hidden = true;
  public message = "";

  private subscriptions = new Subscription();

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.dialogService
        .onShowDialog
        .subscribe(hidden => this.hidden = hidden));

    this.subscriptions.add(
      this.dialogService
        .onMessage
        .subscribe(message => this.message = message));
  }

  public clickHandler(answer: boolean): void {
    this.hidden = true;
    this.message = "";
    this.dialogService.callCallback(answer);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
