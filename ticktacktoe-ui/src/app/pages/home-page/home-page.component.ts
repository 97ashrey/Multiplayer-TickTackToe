import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

  @ViewChild('link') linkInput;

  private subscriptions = new Subscription;

  constructor(
    private gamesService: GamesService,
    private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  newGameClickHandler() {
    this.subscriptions.add(this.gamesService.newGame().subscribe(gameId => {
      this.router.navigate(['games', gameId])
    }));
  }

}
