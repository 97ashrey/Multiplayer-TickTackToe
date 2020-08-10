import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DialogService implements OnDestroy {

  private messageSource = new Subject<string>();
  private showDialogSource = new Subject<boolean>();

  public onShowDialog = this.showDialogSource.asObservable();
  public onMessage = this.messageSource.asObservable();

  private callback: (answer: boolean) => void = null;

  private subscriptions = new Subscription();

  constructor(private router: Router) {
    this.subscriptions.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeDialog();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

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
