using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.DataTransferObjects;
using ticktacktoe.Games;
using ticktacktoe.Games.Payloads;
using ticktacktoe.Requests;
using ticktacktoe.Types;

namespace ticktacktoe.Hubs
{
    public class GameHub : Hub
    {
        private static readonly string GAME_ID_PARAMETER_NAME = "gameId";
        private static readonly string PLAYER_ID_PARAMETER_NAME = "playerId";
        private static readonly string PLAYER_NAME_PARAMETER_NAME = "playerName";

        private IGamesService gamesService;

        public GameHub(IGamesService gamesService)
        {
            this.gamesService = gamesService;
        }

        public async Task Send(string message)
        {
            string gameId = this.GetParameterFromRequest(GAME_ID_PARAMETER_NAME);
            string playerId = this.GetParameterFromRequest(PLAYER_ID_PARAMETER_NAME);
            string playerName = this.GetParameterFromRequest(PLAYER_NAME_PARAMETER_NAME);

            ChatMessage chatMessage = new ChatMessage()
            { 
                PlayerId = playerId, 
                PlayerName = playerName, 
                Message = message 
            };
            await Clients.OthersInGroup(gameId).SendAsync("Message", chatMessage);
        }

        public async Task DoMove(int fieldPosition)
        {
            string gameId = this.GetParameterFromRequest(GAME_ID_PARAMETER_NAME);
            string playerId = this.GetParameterFromRequest(PLAYER_ID_PARAMETER_NAME);

            MoveProcessingResult moveProcessingResult = this.gamesService.ProcessMove(gameId, playerId, fieldPosition);

            await Clients.Group(gameId).SendAsync("MoveResult", moveProcessingResult);
        }

        public async Task VoteForRound(bool vote)
        {
            string gameId = this.GetParameterFromRequest(GAME_ID_PARAMETER_NAME);
            string playerId = this.GetParameterFromRequest(PLAYER_ID_PARAMETER_NAME);

            NextRoundVoteResult result = this.gamesService.VoteForNextRound(gameId, playerId, vote);

            if (result.VoteStatus == VoteStatus.NextRound)
            {
                await Clients.Group(gameId).SendAsync("NextRound", result.GameState);
            } 
            else if (result.VoteStatus == VoteStatus.GameOver)
            {
                await Clients.Group(gameId).SendAsync("GameOver");

            }
        }

        public override async Task OnConnectedAsync()
        {
            ConnectToGameRequest request = this.GetConnectToGameRequest();

            PlayerConnectionResult result = this.gamesService.ConnectPlayer(request.GameId, request.PlayerId, request.PlayerName);
            await Groups.AddToGroupAsync(Context.ConnectionId, request.GameId);

            if (result.AllPlayersConnected)
            {
                await Clients.Group(request.GameId).SendAsync("PlayersConnected", result.GameState);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            DisconnectFromGameRequest request = this.GetDisconnectFromGameRequest();

            Player disconectedPlayer = this.gamesService.DisconectPlayer(request.GameId, request.PlayerId);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, request.GameId);
            await Clients.Group(request.GameId).SendAsync("PlayerDisconnected", disconectedPlayer);

            await base.OnDisconnectedAsync(exception);
        }

        private ConnectToGameRequest GetConnectToGameRequest()
        {
            string gameId = this.GetParameterFromRequest(GAME_ID_PARAMETER_NAME);
            string playerName = this.GetParameterFromRequest(PLAYER_NAME_PARAMETER_NAME);
            string playerId = this.GetParameterFromRequest(PLAYER_ID_PARAMETER_NAME);

            return new ConnectToGameRequest() {
                GameId = gameId,
                PlayerId = playerId,
                PlayerName = playerName
            };
        }

        private DisconnectFromGameRequest GetDisconnectFromGameRequest()
        {
            string gameId = this.GetParameterFromRequest(GAME_ID_PARAMETER_NAME);
            string playerId = this.GetParameterFromRequest(PLAYER_ID_PARAMETER_NAME);

            return new DisconnectFromGameRequest()
            {
                GameId = gameId,
                PlayerId = playerId,
            };
        }

        private string GetParameterFromRequest(string parameterName)
        {
            string parameter = this.Context.GetHttpContext().Request.Query[parameterName];
            if (parameter == null)
            {
                throw new Exception($"Missing '{parameterName}' parameter in request");
            }

            return parameter;
        }
    }
}
