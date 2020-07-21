import { PlayerModel } from "../models/player.model";

export interface PlayerCreatedEvent {
    player: PlayerModel;
}