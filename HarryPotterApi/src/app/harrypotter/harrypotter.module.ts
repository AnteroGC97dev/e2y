import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HarrypotterRoutingModule } from './harrypotter-routing.module';
import { HarrypotterComponent } from './harrypotter.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { MatChipsModule } from '@angular/material/chips';
import { DeleteComponent } from './delete/delete.component';

@NgModule({
  declarations: [
    HarrypotterComponent,
    DeleteComponent,
    ViewComponent,
    EditComponent,
    ListComponent,
  ],
  imports: [
    MatChipsModule,
    CommonModule,
    HarrypotterRoutingModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
  ],
})
export class HarrypotterModule {}
