import { Player } from './player';

export interface NextRoundGameState {
    players: Player[];
    currentPlayer: Player;
    board: string[],
    roundOver: boolean;
    round: number;
}