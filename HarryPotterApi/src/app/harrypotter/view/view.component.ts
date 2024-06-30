import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Character } from 'src/app/models/character.model';

import { HarryPotterService } from 'src/app/services/harrypotter.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent {
  characterDetails$: Observable<Character> | undefined;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private harryPotterService: HarryPotterService,
    private route: ActivatedRoute
  ) {
    this.characterDetails$ = this.harryPotterService.getCharacter(
      this.route.snapshot.paramMap.get('id') || ''
    );
  }
}
