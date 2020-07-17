using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Entities;
using ticktacktoe.Helpers;

namespace ticktacktoe.Repsitories
{
    public class GamesRepository : IGamesRepository
    {
        private ConcurrentDictionary<string, GameEntity> games;

        public GamesRepository(ConcurrentDictionary<string, GameEntity> games)
        {
            this.games = games;
        }

        public void Create(GameEntity game)
        {
            this.games.TryAdd(game.Id, game);
        }

        public void Delete(string id)
        {
            this.games.TryRemove(id, out GameEntity game);
        }

        public GameEntity Get(string id)
        {
            GameEntity game = null;

            this.games.TryGetValue(id, out game);

            return game;
        }

        public void Update(GameEntity game)
        {
            GameEntity existingGame = this.Get(game.Id);
            this.games.TryUpdate(game.Id, game, existingGame);
        }
    }
}
