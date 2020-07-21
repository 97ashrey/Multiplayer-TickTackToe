import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {

  public gameId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('gameId');
  }

}
