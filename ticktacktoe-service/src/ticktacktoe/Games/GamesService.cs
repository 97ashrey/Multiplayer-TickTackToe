using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Entities;
using ticktacktoe.Games.Exceptions;
using ticktacktoe.Repsitories;
using ticktacktoe.Games.Payloads;
using ticktacktoe.Types;

namespace ticktacktoe.Games
{
    public class GamesService : IGamesService
    {
        private static readonly int MAX_PLAYERS_COUNT = 2;
        private static readonly int MAX_BOARD_SIZE = 9;
        private static readonly string X_MOVE = "X";
        private static readonly string O_MOVE = "O";

        private static readonly Dictionary<string, RoundResult> WIN_CONDITION_MAP = new Dictionary<string, RoundResult>()
        {
            {"row-1", RoundResult.TopRow },
            {"row-2", RoundResult.MiddleRow },
            {"row-3", RoundResult.BottomRow },
            {"col-1", RoundResult.LeftColumn },
            {"col-2", RoundResult.MiddleColumn },
            {"col-3", RoundResult.RightColumn },
            {"diag", RoundResult.Diagonal },
            {"inv-diag", RoundResult.InverseDiagonal },
            {"draw", RoundResult.Draw }
        };

        private readonly IGamesRepository gamesRepository;
        private readonly IMapper mapper;

        public GamesService (IGamesRepository gamesRepository, IMapper mapper)
        {
            this.gamesRepository = gamesRepository;
            this.mapper = mapper;
        }

        public PlayerConnectionResult ConnectPlayer(string gameId, string playerId, string playerName)
        {
            GameEntity game = this.GetGameExceptionaly(gameId);

            if (game.NextRoundVotes.VoteStatus == VoteStatus.GameOver)
            {
                throw new GameException($"Game is over.");
            }

            // Players connecting to the game for the first time
            if (game.Players.Count < MAX_PLAYERS_COUNT)
            {
                // Case when one player connected but he disconected for a brief time and is now trying to reconect
                PlayerEntity disconectedPlayer = game.Players.Find(player => player.Id == playerId);

                if (disconectedPlayer != null)
                {
                    disconectedPlayer.Connected = true;
                }
                else
                {
                    PlayerEntity newPlayer = new PlayerEntity()
                    {
                        Id = playerId,
                        Name = playerName,
                        Connected = true
                    };

                    game.Players.Add(newPlayer);
                    game.Score.RegisterKey(playerId);

                    if (game.CurrentPlayer == null)
                    {
                        newPlayer.Move = X_MOVE;
                        game.CurrentPlayer = newPlayer;
                    }
                    else
                    {
                        newPlayer.Move = O_MOVE;
                    }
                }
            } 
            else
            {
                // Check if it's a reconecting player
                PlayerEntity reconectingPlayer = game.Players.Find(player => player.Id == playerId && !player.Connected);

                if (reconectingPlayer != null)
                {
                    reconectingPlayer.Connected = true;
                }
                else
                {
                    throw new GameException($"Game with id '{gameId}' already has two connected players.");
                }
            }
            
            this.gamesRepository.Update(game);

            return new PlayerConnectionResult()
            {
                AllPlayersConnected = game.Players.Count == MAX_PLAYERS_COUNT && game.Players.All(player => player.Connected),
                GameState = this.mapper.Map<Game>(game)
            };
        }

        public PlayerDisconectedResult DisconectPlayer(string gameId, string playerId)
        {
            GameEntity game = this.GetGameExceptionaly(gameId);

            PlayerEntity playerToDisconect = game.Players.Find(p => p.Id == playerId);

            if (playerToDisconect == null)
            {
                throw new GameException($"No player with player ID '{playerId}' is connected to the game with game id '{gameId}'");
            }

            playerToDisconect.Connected = false;

            this.gamesRepository.Update(game);

            return new PlayerDisconectedResult()
            {
                VoteStatus = game.NextRoundVotes.VoteStatus,
                RoundResult = game.RoundResult
            };
        }

        public string Create()
        {
            string gameId = Guid.NewGuid().ToString();

            GameEntity newGame = new GameEntity()
            {
                Id = gameId,
                Players = new List<PlayerEntity>(),
                CurrentPlayer = null,
                Score = new Score(),
                Round = 1,
                RoundResult = RoundResult.NotOver,
                Board = new string[] {
                    "", "", "",
                    "", "", "",
                    "", "", "",
                },
                NextRoundVotes = new NextRoundVotes(MAX_PLAYERS_COUNT)
            };

            this.gamesRepository.Create(newGame);

            return gameId;
        }

        public void Delete(string gameId)
        {
            this.gamesRepository.Delete(gameId);
        }

        public Game Get(string gameId)
        {
            GameEntity gameEntity = this.gamesRepository.Get(gameId);

            return this.mapper.Map<Game>(gameEntity);
        }

        public MoveProcessingResult ProcessMove(string gameId, string playerId, int fieldPosition)
        {
            GameEntity game = this.DoMove(gameId, playerId, fieldPosition);

            game.RoundResult = this.GetRoundResult(game.Board, fieldPosition, game.CurrentPlayer.Move);

            bool winCondition = game.RoundResult != RoundResult.NotOver && game.RoundResult != RoundResult.Draw;

            if (winCondition)
            {
                game.Score.Increment(game.CurrentPlayer.Id, 1);
            } 
            else
            {
                game.CurrentPlayer = game.Players.Find(p => p.Id != game.CurrentPlayer.Id);
            }

            this.gamesRepository.Update(game);

            MoveProcessingResult moveProcessingResult = this.mapper.Map<MoveProcessingResult>(game);

            return moveProcessingResult;
        }

        public NextRoundVoteResult VoteForNextRound(string gameId, string playerId, bool vote)
        {
            GameEntity game = this.GetGameExceptionaly(gameId);

            if (game.RoundResult == RoundResult.NotOver)
            {
                throw new GameException("Round is not over.");
            }

            if (!game.NextRoundVotes.Vote(playerId, vote))
            {
                throw new GameException($"Player with {playerId} already voted.");
            }

            VoteStatus status = game.NextRoundVotes.VoteStatus;

            if (status == VoteStatus.NextRound)
            {
                this.StartNewRound(game);
                this.gamesRepository.Update(game);
            }

            NextRoundVoteResult voteResult = new NextRoundVoteResult()
            {
                VoteStatus = status,
                GameState = this.mapper.Map<NextRoundGameState>(game)
            };

            return voteResult;
        }

        private void StartNewRound(GameEntity game)
        {
            game.Round += 1;
            game.RoundResult = RoundResult.NotOver;
            game.NextRoundVotes.Clear();

            string p1Move = game.Players[0].Move;
            game.Players[0].Move = game.Players[1].Move;
            game.Players[1].Move = p1Move;

            game.CurrentPlayer = game.Players.Find(p => p.Move == X_MOVE);

            game.Board = new string[] {
                    "", "", "",
                    "", "", "",
                    "", "", "",
                };
        }

        private VoteStatus GetVoteStatus(Dictionary<string, bool> votes)
        {
            VoteStatus status = VoteStatus.WaitingForVotes;

            if (votes.Count == MAX_PLAYERS_COUNT)
            {
                if (votes.Values.All(value => value == true))
                {
                    status = VoteStatus.NextRound;
                } else
                {
                    status = VoteStatus.GameOver;
                }

            }

            return status;
        }

        private GameEntity DoMove(string gameId, string playerId, int fieldPosition)
        {

            if (!this.IsIndexInRange(fieldPosition))
            {
                throw new GameException($"Field position '{fieldPosition}' is not valid.");
            }

            GameEntity game = this.GetGameExceptionaly(gameId);

            if (game.CurrentPlayer.Id != playerId)
            {
                throw new GameException($"Player with id '{playerId}' can't make a move because it's not his turn.");
            }

            if (game.RoundResult != RoundResult.NotOver)
            {
                throw new GameException($"Round is over can't do any more moves.");
            }

            string field = game.Board[fieldPosition];

            if (field != "")
            {
                throw new GameException($"Move at position '{fieldPosition}' has already been made.");
            }

            game.Board[fieldPosition] = game.CurrentPlayer.Move;

            return game;
        }

        private RoundResult GetRoundResult(string[] board, int fieldPosition, string pInput)
        {
            //turn index into rows and colls
            int width = 3;
            int row = fieldPosition / width;
            int col = Math.Abs(fieldPosition - width * row);

            int numberOfMovesPlayed = board.Count(field => field != "");

            if (numberOfMovesPlayed < 5)
            {
                return RoundResult.NotOver;
            }

            // look for winner
            // row checks
            for (int i = 0; i < 3; i++)
            {
                if (board[width * row + i] != pInput)
                {
                    break;
                }
                if (i == width - 1)
                {
                    string key = $"row-{row + 1}";
                    return WIN_CONDITION_MAP[key];
                }
            }

            // col check
            for (int i = 0; i < width; i++)
            {
                if (board[width * i + col] != pInput)
                {
                    break;
                }
                if (i == width - 1)
                {
                    string key = $"col-{col + 1}";
                    return WIN_CONDITION_MAP[key];
                }
            }

            // Prim Diag Check
            if (col == row)
            {
                for (int i = 0; i < width; i++)
                {
                    if (board[width * i + i] != pInput)
                    {
                        break;
                    }
                    if (i == width - 1)
                    {
                        string key = "diag";
                        return WIN_CONDITION_MAP[key];
                    }
                }
            }

            // Inv diag check
            if ((col + row) == width - 1)
            {
                for (int i = 0; i < width; i++)
                {
                    if (board[width * i + (width - 1 - i)] != pInput)
                    {
                        break;
                    }
                    if (i == width - 1)
                    {
                        string key = "inv-diag";
                        return WIN_CONDITION_MAP[key];
                    }
                }
            }

            return numberOfMovesPlayed == MAX_BOARD_SIZE ? RoundResult.Draw : RoundResult.NotOver;
        }

        private bool IsIndexInRange(int index)
        {
            return 0 <= index && index < MAX_BOARD_SIZE;
        }

        private GameEntity GetGameExceptionaly(string gameId)
        {
            GameEntity game = this.gamesRepository.Get(gameId);

            if (game == null)
            {
                throw new GameException($"Game with id '{gameId}' doesnt exist.");
            }

            return game;
        }

    }
}
