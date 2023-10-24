import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { ProfesorLeaderRoutingModule } from './profesor-leader.routing.module';
import { PlmainComponent } from './plmain/plmain.component';
import { AulaProjectsComponent } from './aula-projects/aula-projects.component';
import { WorkplansModule } from '../workplans/workplans.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AulaProjectViewComponent } from './aula-project-view/aula-project-view.component';
import { AulaProjectActivitiesComponent } from './activities/activities.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    DashboardComponent,
    PlmainComponent,
    AulaProjectsComponent,
    AulaProjectViewComponent,
    AulaProjectActivitiesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ProfesorLeaderRoutingModule,
    WorkplansModule,
    ReactiveFormsModule,
    PrimeNgModule
  ],
})
export class ProfesorLeaderModule {}
