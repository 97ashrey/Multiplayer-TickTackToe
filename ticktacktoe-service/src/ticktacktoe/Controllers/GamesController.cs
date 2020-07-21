using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ticktacktoe.Games;

namespace ticktacktoe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private IGamesService gamesService;

        public GamesController(IGamesService gamesService)
        {
            this.gamesService = gamesService;
        }

        [HttpGet("newGame")]
        public IActionResult NewGame()
        {
            return Ok(new { GameId = this.gamesService.Create() });

        }

        [HttpGet("{id}")]
        public IActionResult GetGame(string id)
        {
            return Ok(this.gamesService.Get(id));
        }
    }
}
