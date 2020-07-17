using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Entities;

namespace ticktacktoe.Repsitories
{
    public interface IGamesRepository
    {
        void Create(GameEntity game);

        void Update(GameEntity game);

        GameEntity Get(string id);

        void Delete(string id);
    }
}
