using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Entities;
using ticktacktoe.Games;
using ticktacktoe.Games.Payloads;

namespace ticktacktoe.AutoMapperProfiles
{
    public class DefaultProfile : Profile
    {
        public DefaultProfile()
        {
            CreateMap<Game, GameEntity>();
            CreateMap<GameEntity, Game>();
            CreateMap<GameEntity, NextRoundGameState>();
            CreateMap<GameEntity, MoveProcessingResult>();
            CreateMap<PlayerEntity, Player>();
            CreateMap<Player, PlayerEntity>();
        }
    }
}
