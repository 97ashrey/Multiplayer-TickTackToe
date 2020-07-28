import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private messageSource = new Subject<string>();
  private showDialogSource = new Subject<boolean>();

  public onShowDialog = this.showDialogSource.asObservable();
  public onMessage = this.messageSource.asObservable();

  private callback: (answer: boolean) => void = null;

  constructor() { }

  public callCallback(answer: boolean) {
    if (this.callback) {
      this.callback(answer);
      this.callback = null;
    }
  }

  public showDialog(message: string, callback: (answer: boolean) => void): void {
    this.showDialogSource.next(false);
    this.messageSource.next(message);
    this.callback = callback;
  }

  public closeDialog(): void {
    this.showDialogSource.next(true);
    this.callback = null;
  }
}
