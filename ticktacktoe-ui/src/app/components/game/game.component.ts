import { Component, OnInit, Input } from '@angular/core';
import { PlayerCreatedEvent } from 'src/app/events/player-created.event';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input() public gameId: string;

  constructor() { }

  ngOnInit(): void {
  }

  
  public playerCreatedHandler(playerCreatedEvent: PlayerCreatedEvent): void {
    console.log(playerCreatedEvent);
  }
}
