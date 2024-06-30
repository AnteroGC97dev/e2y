import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HarrypotterComponent } from './harrypotter.component';
import { HarryPotterService } from '../services/harrypotter.service';
import { of, throwError } from 'rxjs';
import { Character } from '../models/character.model';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HarrypotterModule } from './harrypotter.module';

describe('HarrypotterComponent', () => {
  let component: HarrypotterComponent;
  let fixture: ComponentFixture<HarrypotterComponent>;
  let harryPotterService: HarryPotterService;
  let httpMock: HttpTestingController;

  const mockCharacters: Character[] = [
    {
      id: '1',
      attributes: { name: 'Harry Potter', image: 'harry.png' },
      isFavorite: false,
    },
    {
      id: '2',
      attributes: { name: 'Hermione Granger', image: 'hermione.png' },
      isFavorite: false,
    },
  ];

  const mockFavoriteCharacters: Character[] = [
    {
      id: '1',
      attributes: { name: 'Harry Potter', image: 'harry.png' },
      isFavorite: true,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatToolbarModule,
        HarrypotterModule,
      ],
      declarations: [HarrypotterComponent],
      providers: [HarryPotterService],
    }).compileComponents();

    fixture = TestBed.createComponent(HarrypotterComponent);
    component = fixture.componentInstance;
    harryPotterService = TestBed.inject(HarryPotterService);
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load characters and check favorites', () => {
    spyOn(harryPotterService, 'getCharacters').and.returnValue(
      of(mockCharacters)
    );
    spyOn(component, 'CheckFavorite').and.returnValue(mockFavoriteCharacters);

    component.loadCharacters();

    expect(harryPotterService.getCharacters).toHaveBeenCalledWith({});
    expect(component.CheckFavorite).toHaveBeenCalledWith(mockCharacters);
    expect(component.characters).toEqual(mockFavoriteCharacters);
  });

  it('should handle error when loading characters', () => {
    spyOn(window, 'alert');
    spyOn(harryPotterService, 'getCharacters').and.returnValue(
      throwError('error')
    );

    component.loadCharacters();

    expect(harryPotterService.getCharacters).toHaveBeenCalledWith({});
    expect(window.alert).toHaveBeenCalledWith('error al cargar la lista');
  });
});
