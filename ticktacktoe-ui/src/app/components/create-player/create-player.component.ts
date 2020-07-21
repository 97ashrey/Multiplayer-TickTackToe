import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PlayerCreatedEvent } from '../../events/player-created.event';
import { v1 as uuid } from 'uuid';
import { PlayerStorageService } from 'src/app/services/player-storage.service';
import { PlayerModel } from 'src/app/models/player.model';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.scss']
})
export class CreatePlayerComponent implements OnInit {

  @Input() public createButtonText: "Create";
  @Output() public playerCreated = new EventEmitter<PlayerCreatedEvent>();

  public playerName = '';

  constructor(private playerStorageService: PlayerStorageService) {}

  ngOnInit(): void {
    const player = this.playerStorageService.getPlayer();
    this.playerName = player.name || '';

    if (player.id !== null) {
      console.log(player);

      this.playerCreated.emit({player});
    }
  }

  public createPlayerHandler() {
    if (this.playerName === null || this.playerName === '') {
      return;
    }

    const player : PlayerModel = {
      id: uuid(),
      name: this.playerName
    }

    this.playerStorageService.setPlayer(player)

    this.playerCreated.emit({player});
  }

}
