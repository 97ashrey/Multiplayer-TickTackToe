import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { LinePosition } from '../../types/line-position';
import { PlayersConnectionService } from 'src/app/services/players-connection.service';
import { take, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

const DRAW_LINE_ANIMATION_LENGTH = 1500;
const EVENT_EMITT_DELAY = 500;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  @Input() board: string[] = ["","","","","","","","",""]
  @Input() currentPlayerMove: string;
  @Input() currentPlayerId: string;
  @Input() set linePosition (value: LinePosition) {
    this.line = value;
    if (this.line) {
      console.log(this.line)
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        this.lineDrawn.emit();
      }, DRAW_LINE_ANIMATION_LENGTH + EVENT_EMITT_DELAY);
    }
  }

  @Output() fieldClicked = new EventEmitter<number>();
  @Output() lineDrawn = new EventEmitter<void>();

  public line: LinePosition;

  public thisClientPlayerId: string;
  public otherClientConnected: boolean;

  private subscriptions = new Subscription();

  constructor(private playersConnectionService: PlayersConnectionService) { }

  ngOnInit(): void {
    this.playersConnectionService.getThisClientPlayer()
      .pipe(take(1))
      .subscribe(player => {
      this.thisClientPlayerId = player.id;
    });

    this.subscriptions.add(
      this.playersConnectionService.getOtherClientPlayer()
        .subscribe(player => this.otherClientConnected = player.connected)
    ); 
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public fieldClickHandler(fieldPosition: number) {
    if (this.otherClientConnected) {
      this.fieldClicked.emit(fieldPosition);
    }
  }

}
