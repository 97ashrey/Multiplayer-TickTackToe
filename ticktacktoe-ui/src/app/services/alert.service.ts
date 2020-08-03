import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertModel } from '../models/alert-model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSource = new Subject<AlertModel>();
  public onShowAlert = this.alertSource.asObservable();
  constructor() { }

  public showAlert(alertModel: AlertModel): void {
    this.alertSource.next(alertModel);
  }
}
