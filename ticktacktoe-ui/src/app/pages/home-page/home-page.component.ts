import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  @ViewChild('link') linkInput;

  public newGameButtonDisabled = false;

  constructor(
    private gamesService: GamesService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.spinner.hide();
  }

  newGameClickHandler() {
    this.requestStarted();

    this.gamesService.newGame().subscribe(
      gameId => {
        this.requestEnded();
        this.router.navigate(['games', gameId])
      },
      error => {
        this.requestEnded();
        this.alertService.showAlert({
          type: 'danger',
          text: 'Failed to create the game'
        });
      }
    );
  }

  private requestStarted() {
    this.spinner.show();
    this.newGameButtonDisabled = true;
  }

  private requestEnded() {
    this.spinner.hide();
    this.newGameButtonDisabled = false;
  }

}
