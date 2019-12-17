import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './root/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ExperimentListComponent } from './components/experiment-list/experiment-list.component';
import { ExperimentStateColorPipe } from './components/pipes/experiment-state-color.pipe';
import { FormatDatePipe } from './components/pipes/format-date.pipe';
import { FormsModule } from '@angular/forms';
import { NewExperimentComponent } from './components/new-experiment/new-experiment.component';
import { ExperimentOverviewComponent } from './components/experiment-overview/experiment-overview.component';

@NgModule({
  declarations: [
    HomeComponent,
    ExperimentListComponent,
    ExperimentStateColorPipe,
    FormatDatePipe,
    NewExperimentComponent,
    ExperimentOverviewComponent
  ],
  imports: [CommonModule, FormsModule, SharedModule, HomeRoutingModule],
  providers: [],
  entryComponents: [NewExperimentComponent]
})
export class HomeModule {}
