import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HarrypotterComponent } from './harrypotter.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: HarrypotterComponent },
  { path: 'view/:id', component: ViewComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'list', component: ListComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HarrypotterRoutingModule {}
