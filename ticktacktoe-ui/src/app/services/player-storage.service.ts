import { Injectable } from '@angular/core';
import { PlayerModel } from '../models/player.model';

const SessionStorageKeys = {
  PLAYER_ID: 'ticktacktoe.playerId',
  PLAYER_NAME: 'ticktacktoe.playerName'
}

@Injectable({
  providedIn: 'root'
})
export class PlayerStorageService {

  constructor() { }

  public getPlayer() : PlayerModel {
    return {
      id: sessionStorage.getItem(SessionStorageKeys.PLAYER_ID),
      name: localStorage.getItem(SessionStorageKeys.PLAYER_NAME)
    }
  }

  public setPlayer(player: PlayerModel) : void {
    sessionStorage.setItem(SessionStorageKeys.PLAYER_ID, player.id);
    localStorage.setItem(SessionStorageKeys.PLAYER_NAME, player.name);
  }
}
