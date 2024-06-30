import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { HarryPotterService } from 'src/app/services/harrypotter.service';
import { Character } from 'src/app/models/character.model';
import { DeleteComponent } from '../delete/delete.component';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnDestroy {
  displayColums = ['select', 'name', 'house', 'image', 'actions'];

  characters: Character[] = [];
  dataSource = new MatTableDataSource(this.characters);
  selection = new SelectionModel(true, []);
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private harryPotterService: HarryPotterService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.loadCharacters();
  }

  loadCharacters() {
    this.harryPotterService
      .getFavorite()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Character[]) => {
          this.characters = data;
          this.dataSource.data = this.characters;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => alert('error al cargar la lista'),
      });
  }

  confirmDelete(id: string): void {
    this.dialog
      .open(DeleteComponent, {
        width: '250px',
        data: id,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.loadCharacters();

        this.cdr.detectChanges();
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
