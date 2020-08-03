import { Player } from './player';
import { RoundResult } from '../../types/round-result';

export interface GameState {
    id: string;
    players: Player[];
    currentPlayer: Player;
    board: string[],
    roundResult: RoundResult;
    round: number;
    score: any;
}