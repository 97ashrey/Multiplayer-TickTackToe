import { Player } from './player';

export interface GameState {
    id: string;
    players: Player[];
    currentPlayer: Player;
    board: string[],
    roundOver: boolean;
    round: number;
    score: any;
    lineThrough?: string;
}