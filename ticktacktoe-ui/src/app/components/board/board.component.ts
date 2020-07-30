import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LinePosition } from '../../types/line-position';

const DRAW_LINE_ANIMATION_LENGTH = 1500;
const EVENT_EMITT_DELAY = 500;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges {

  @Input() board: string[] = ["","","","","","","","",""]
  @Input() currentPlayerMove: string;
  @Input() linePosition: LinePosition;
  @Input() currentPlayerId: string;
  @Input() thisClientPlayerId: string;

  @Output() fieldClicked = new EventEmitter<number>();
  @Output() lineDrawn = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.linePosition) {
      console.log(this.linePosition)
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        this.lineDrawn.emit();
      }, DRAW_LINE_ANIMATION_LENGTH + EVENT_EMITT_DELAY);
    }
  }

  public fieldClickHandler(fieldPosition: number) {
    this.fieldClicked.emit(fieldPosition);
  }

}
