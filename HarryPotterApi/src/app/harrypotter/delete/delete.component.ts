import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HarryPotterService } from 'src/app/services/harrypotter.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
})
export class DeleteComponent {
  private subscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private harryPotterService: HarryPotterService
  ) {}

  onSiClick(): void {
    this.subscription = this.harryPotterService
      .deleteCharacter(this.data)
      .subscribe({
        error: (e) => alert('Error, ha ocurrido algo inesperado'),
      });
    this.dialogRef.close();
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
