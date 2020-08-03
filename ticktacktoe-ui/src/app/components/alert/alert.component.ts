import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertType} from '../../types/alert-type';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() type: AlertType;
  @Input() text: string;

  @Output() onClose = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public closeButtonClickHandler(): void {
    this.onClose.emit();
  }
}
