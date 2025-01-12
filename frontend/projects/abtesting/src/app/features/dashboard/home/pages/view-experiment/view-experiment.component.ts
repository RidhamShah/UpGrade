import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExperimentService } from '../../../../../core/experiments/experiments.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ExperimentStatusComponent } from '../../components/modal/experiment-status/experiment-status.component';
import { PostExperimentRuleComponent } from '../../components/modal/post-experiment-rule/post-experiment-rule.component';
import { NewExperimentComponent } from '../../components/modal/new-experiment/new-experiment.component';
import {
  EXPERIMENT_STATE,
  ExperimentVM,
  EXPERIMENT_SEARCH_KEY
} from '../../../../../core/experiments/store/experiments.model';
import { Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { DeleteExperimentComponent } from '../../components/modal/delete-experiment/delete-experiment.component';
import { UserPermission } from '../../../../../core/auth/store/auth.models';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router } from '@angular/router';
import * as clonedeep from 'lodash.clonedeep';
import { ExperimentStatePipeType } from '../../../../../shared/pipes/experiment-state.pipe';
import { QueriesModalComponent } from '../../components/modal/queries-modal/queries-modal.component';
import { ExperimentEndCriteriaComponent } from '../../components/modal/experiment-end-criteria/experiment-end-criteria.component';

// Used in view-experiment component only
enum DialogType {
  CHANGE_STATUS = 'Change status',
  CHANGE_POST_EXPERIMENT_RULE = 'Change post experiment rule',
  EDIT_EXPERIMENT = 'Edit Experiment'
}

@Component({
  selector: 'home-view-experiment',
  templateUrl: './view-experiment.component.html',
  styleUrls: ['./view-experiment.component.scss']
})
export class ViewExperimentComponent implements OnInit, OnDestroy {
  permissions: UserPermission;
  permissionsSub: Subscription;
  experiment: ExperimentVM;
  experimentSub: Subscription;

  displayedConditionColumns: string[] = ['no', 'conditionCode', 'assignmentWeight', 'description'];
  displayedPartitionColumns: string[] = ['no', 'partitionPoint', 'partitionId'];

  constructor(
    private experimentService: ExperimentService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.permissionsSub = this.authService.userPermissions$.subscribe(permission => {
      this.permissions = permission;
    });
    this.experimentSub = this.experimentService.selectedExperiment$
      .pipe(filter(experiment => !!experiment))
      .subscribe(experiment => {
        if (!this.experiment) {
          this.experimentService.fetchExperimentDetailStat(experiment.id);
        }
        // By refreshing page if we would have experimentId then only assign it's value
        if (experiment.id) {
          this.experiment = experiment;
        }
      });
  }

  openSnackBar() {
    this.authService.currentUser$.pipe(
      first()
    ).subscribe(userInfo => {
      if (userInfo.email) {
        this._snackBar.open(`Email will be sent to ${userInfo.email}`, null, { duration: 2000 })
      } else {
        this._snackBar.open(`Email will be sent to registered email`, null, { duration: 2000 })
      }
    });
  }

  openDialog(dialogType: DialogType) {
    const dialogComponent =
      dialogType === DialogType.CHANGE_STATUS
        ? ExperimentStatusComponent
        : dialogType === DialogType.CHANGE_POST_EXPERIMENT_RULE
        ? PostExperimentRuleComponent
        : NewExperimentComponent;
    const dialogRef = this.dialog.open(dialogComponent as any, {
      panelClass: dialogType === DialogType.EDIT_EXPERIMENT ? 'new-experiment-modal' : 'experiment-general-modal',
      data: { experiment: clonedeep(this.experiment) },
      disableClose : dialogType === DialogType.EDIT_EXPERIMENT
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  searchExperiment(type: EXPERIMENT_SEARCH_KEY, value: string) {
    this.experimentService.setSearchKey(type);
    this.experimentService.setSearchString(value);
    this.router.navigate(['/home']);
  }

  deleteExperiment() {
    const dialogRef = this.dialog.open(DeleteExperimentComponent, {
      panelClass: 'delete-modal',
      data: { experimentName: this.experiment.name, experimentId: this.experiment.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Add code of further actions after deleting experiment
    });
  }

  openQueriesModal() {
    const dialogRef = this.dialog.open(QueriesModalComponent, {
      panelClass: 'queries-modal',
      data: { experiment: clonedeep(this.experiment) }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Add code of further actions after opening query modal
    });
  }

  updateEndingCriteria() {
    const dialogRef = this.dialog.open(ExperimentEndCriteriaComponent, {
      panelClass: 'experiment-ending-criteria',
      data: { experiment: clonedeep(this.experiment) }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Add code of further actions after opening query modal
    });
  }

  exportExperimentInfo(experimentId: string, experimentName: string) {
    this.experimentService.exportExperimentInfo(experimentId, experimentName);
    this.openSnackBar();
  }

  getConditionCode(conditionId: string) {
    return !!this.experiment ? '(' + this.experiment.conditions.find(condition => condition.id === conditionId).conditionCode + ')' : '';
  }

  get DialogType() {
    return DialogType;
  }

  toggleVerboseLogging(event) {
    this.experimentService.updateExperiment({...this.experiment, logging: event.checked })
  }

  ngOnDestroy() {
    this.experimentSub.unsubscribe();
    this.permissionsSub.unsubscribe();
  }

  get ExperimentState() {
    return EXPERIMENT_STATE;
  }

  get ExperimentSearchKey() {
    return EXPERIMENT_SEARCH_KEY;
  }

  get ExperimentStatePipeTypes() {
    return ExperimentStatePipeType;
  }

  get isExperimentStateCancelled() {
    return this.experiment.state === EXPERIMENT_STATE.CANCELLED;
  }
}
