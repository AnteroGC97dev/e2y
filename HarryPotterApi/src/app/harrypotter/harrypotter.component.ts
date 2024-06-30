import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HarryPotterService } from '../services/harrypotter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, switchMap, takeUntil, tap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Character } from '../models/character.model';
import { HogwartsHouse } from '../models/houses-utils';

@Component({
  selector: 'app-harrypotter',
  templateUrl: './harrypotter.component.html',
  styleUrls: ['./harrypotter.component.scss'],
})
export class HarrypotterComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;

  characters: Character[] = [];
  favorites: Character[] = [];
  charactersFilter: Character[] = [];
  loading: boolean = false;
  paginator: number = 1;
  houses = Object.values(HogwartsHouse);
  private unsubscribe$ = new Subject<void>();
  enableButton: boolean = true;

  constructor(
    private harryPotterService: HarryPotterService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchBar: new FormControl(''),
      filterHouse: new FormControl({ value: '', disabled: true }),
    });

    this.loadFavorites();
  }

  loadCharacters(favorites?: Character[]) {
    this.harryPotterService
      .getCharacters({})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Character[]) => {
          this.characters = this.CheckFavorite(data);
        },
        error: (e) => alert('error al cargar la lista'),
      });
  }
  loadFavorites() {
    this.harryPotterService
      .getFavorite()
      .pipe(
        tap((favorites) => {
          if (!this.characters.length) {
            this.loadCharacters(favorites);
          } else {
            this.favorites = favorites;
            this.characters = this.CheckFavorite(this.characters);
          }
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Character[]) => {
          this.favorites = data;
          this.characters = this.CheckFavorite(this.characters);
        },
        error: (e) => alert('error al cargar la lista'),
      });
  }

  CheckFavorite(characters: Character[]) {
    return characters.map((character) => {
      return {
        ...character,
        isFavorite: this.favorites.some((fav) => fav.id === character.id),
      };
    });
  }
  ngOnInit() {
    this.searchForm
      .get('searchBar')
      ?.valueChanges.pipe(
        tap(() => (this.loading = true)),
        debounceTime(1000),
        switchMap((data) =>
          this.harryPotterService
            .getCharacters({
              filterName: data,
              filterHouse: this.searchForm.get('filterHouse')?.enabled
                ? this.searchForm.get('filterHouse')?.value
                : null,
            })
            .pipe(takeUntil(this.unsubscribe$))
        )
      )
      .subscribe({
        next: (data) => {
          this.paginator = 1;
          this.loading = false;
          const checkFavorite = this.CheckFavorite(data);
          this.characters = checkFavorite;
          console.log(this.characters);
        },
        error: () => {
          this.paginator = 1;
          this.loading = false;
          alert('error al cargar la lista');
        },
      });
  }
  saveCharacter(character: Character) {
    this.harryPotterService.addCharacter(character).subscribe({
      error: (e) => {
        alert('error al cargar la lista');
      },
      complete: () => {
        alert('Personaje añadido a favoritos');
        this.loadFavorites();
      },
    });
  }
  deleteCharacter(id: string) {
    this.harryPotterService
      .deleteCharacter(id)

      .subscribe({
        error: (e) => {
          alert('error al cargar la lista');
        },
        complete: () => {
          alert('Personaje borrado de favoritos');
          this.loadFavorites();
        },
      });
  }
  searchClose() {
    this.searchForm.get('searchBar')?.setValue('');
  }

  searchMore(isFromFilter?: boolean) {
    if (!isFromFilter) {
      this.paginator++;
    }
    this.harryPotterService
      .getCharacters({
        filterName: this.searchForm.get('searchBar')?.value ?? '',
        paginator: !isFromFilter ? this.paginator : undefined,
        filterHouse:
          this.searchForm.get('filterHouse') &&
          this.searchForm.get('filterHouse')?.enable
            ? this.searchForm.get('filterHouse')?.value
            : null,
      })
      .pipe(
        tap(() => (this.loading = true)),
        debounceTime(1000),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.loading = false;
        if (isFromFilter) {
          this.characters = [];
        }
        this.characters = this.characters.concat(data);
        this.characters = this.CheckFavorite(this.characters);

        console.log(this.characters);
      });
  }
  disableHouseControl() {
    this.paginator = 1;
    this.enableButton = true;
    this.searchForm.get('filterHouse')?.disable();
    this.harryPotterService
      .getCharacters({
        filterName: this.searchForm.get('searchBar')?.value ?? '',
      })
      .pipe(
        tap(() => (this.loading = true)),
        debounceTime(1000),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.loading = false;

        this.characters = [];

        this.characters = this.CheckFavorite(data);
        console.log(this.characters);
      });
  }

  enableHouseControl() {
    this.paginator = 1;
    this.enableButton = false;
    this.searchForm.get('filterHouse')?.enable();
    if (this.searchForm.get('filterHouse')?.value !== '') this.searchMore(true);
  }
  setFilter(house: string) {
    this.paginator = 1;
    this.searchForm.get('filterHouse')?.setValue(house);
    this.searchMore(true);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
