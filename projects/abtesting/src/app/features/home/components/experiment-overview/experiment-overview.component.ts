import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { ASSIGNMENT_UNIT, CONSISTENCY_RULE } from 'ees_types';
import { GroupTypes } from '../../../../core/experiments/store/experiments.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'home-experiment-overview',
  templateUrl: './experiment-overview.component.html',
  styleUrls: ['./experiment-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperimentOverviewComponent {

  @Input() overviewForm: FormGroup;
  @Output() emitDialogCloseEvent = new EventEmitter<boolean>();
  unitOfAssignments = [
    { type: ASSIGNMENT_UNIT.INDIVIDUAL, viewValue: 'Individual'},
    { type: ASSIGNMENT_UNIT.INDIVIDUAL, viewValue: 'Group'}
  ];

  groupTypes = [
    { type: GroupTypes.CLASS, viewValue: 'Class' },
    { type: GroupTypes.SCHOOL, viewValue: 'School' },
    { type: GroupTypes.DISTRICT, viewValue: 'District' }
  ];

  consistencyRules = [
    { type: CONSISTENCY_RULE.INDIVIDUAL, viewValue: 'Individual' },
    { type: CONSISTENCY_RULE.GROUP, viewValue: 'Group' },
    { type: CONSISTENCY_RULE.EXPERIMENT, viewValue: 'Experiment' }
  ];

  // Used to control tags
  isTagSelectable = true;
  isTagRemovable = true;
  addTagOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  experimentTags = [];

  constructor() { }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our experimentTags
    if ((value || '').trim()) {
      this.experimentTags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(experimentTags): void {
    const index = this.experimentTags.indexOf(experimentTags);
    if (index >= 0) {
      this.experimentTags.splice(index, 1);
    }
  }

  closeDialog() {
    this.emitDialogCloseEvent.emit(true);
  }
}
