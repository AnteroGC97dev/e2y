import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { HarryPotterService } from 'src/app/services/harrypotter.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnDestroy {
  private subscription?: Subscription;

  editcharacterForm: FormGroup;

  characterData?: Character;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private route: Router,
    private harryPotterService: HarryPotterService
  ) {
    this.editcharacterForm = this.fb.group({
      response: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(3),
        ],
      ],
      house: [''],
      image: ['', [this.pngUrlValidator.bind(this)]],
    });
  }

  pngUrlValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value as string;
    if (url && !url.toLowerCase().endsWith('.jpg')) {
      return { invalidFormat: 'La URL debe terminar con .png' };
    }
    return null;
  }
  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id') || '';
    this.harryPotterService
      .getCharacterById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.characterData = data;
          this.editcharacterForm?.patchValue({
            id: data.id,
            name: data.attributes.name,
            house: data.attributes.house,
            image: data.attributes.image,
          });
        },
        error: () => {
          alert('Error, ha ocurrido algo inesperado');
        },
      });
  }
  onSubmit() {
    if (this.editcharacterForm.valid) {
      const updateFormData: Character = {
        attributes: { ...this.editcharacterForm.value },
        id: this.router.snapshot.paramMap.get('id') || '',
        isFavorite: true,
      };
      this.subscription = this.harryPotterService
        .updatecharacter(updateFormData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.route.navigate(['harrypotter/list']);
          alert('Personaje editado correctamente');
        });
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
