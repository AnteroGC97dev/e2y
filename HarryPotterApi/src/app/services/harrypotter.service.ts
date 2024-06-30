import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Character } from '../models/character.model';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { QueryParamKeys } from './harrypotter-service-utils';
import { CharacterSearchParams } from './harrypotter-service.model';
/* istanbul ignore file */
@Injectable({
  providedIn: 'root',
})
export class HarryPotterService {
  private apiUrl = 'http://localhost:3000/personajes';
  private harryPotterApiUrl = 'https://api.potterdb.com/v1';
  private defaultPageSize = 10;

  constructor(private httpClient: HttpClient) {}
  addCharacter(character: Character): Observable<Character> {
    return this.httpClient.post<Character>(this.apiUrl, character);
  }

  getCharacters(params: CharacterSearchParams): Observable<Character[]> {
    let httpParams = new HttpParams().set(
      QueryParamKeys.PageSize,
      this.defaultPageSize.toString()
    );

    if (params.filterName) {
      httpParams = httpParams.set(QueryParamKeys.FilterName, params.filterName);
    }
    if (params.paginator !== undefined && params.paginator !== null) {
      httpParams = httpParams.set(
        QueryParamKeys.PageNumber,
        params.paginator.toString()
      );
    }
    if (params.filterHouse) {
      httpParams = httpParams.set(
        QueryParamKeys.FilterHouse,
        params.filterHouse
      );
    }

    return this.httpClient
      .get<any>(`${this.harryPotterApiUrl}/characters`, { params: httpParams })
      .pipe(map((data) => data.data));
  }

  getFavorite(): Observable<Character[]> {
    return this.httpClient.get<Character[]>(this.apiUrl);
  }

  getCharacterByIdFromFavorites(id: string): Observable<Character | null> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Character>(url).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  getCharacterById(id: string): Observable<Character> {
    const url = `${this.harryPotterApiUrl}/characters/${id}`;
    return this.httpClient
      .get<any>(url)
      .pipe(map((data) => data.data as Character));
  }

  getCharacter(id: string): Observable<Character> {
    return this.getCharacterByIdFromFavorites(id).pipe(
      switchMap((character) => {
        if (character) {
          return of(character);
        } else {
          return this.getCharacterById(id);
        }
      })
    );
  }

  updatecharacter(character: Character): Observable<Character> {
    const url = `${this.apiUrl}/${character.id}`;
    return this.httpClient.put<Character>(url, character);
  }

  deleteCharacter(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
