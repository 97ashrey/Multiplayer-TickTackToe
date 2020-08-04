import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertModel } from '../../models/alert-model';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-container',
  templateUrl: './alert-container.component.html',
  styleUrls: ['./alert-container.component.scss']
})
export class AlertContainerComponent implements OnInit, OnDestroy {

  public alert: AlertModel;

  private subscriptions = new Subscription();

  private alertTimeout;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.alertService.onShowAlert
      .subscribe(alert => {
        if (this.alertTimeout) {
          clearTimeout(this.alertTimeout)
        }
        this.alertTimeout = setTimeout(() => this.alert = null, 3000);
        this.alert = alert;
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onCloseHandler(): void {
    this.alert = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout)
    }
  }

}
