import { IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';
import { ExperimentCondition } from '../api/models/ExperimentCondition';
import { ExperimentPartition } from '../api/models/ExperimentPartition';
import {
  EXPERIMENT_STATE,
  CONSISTENCY_RULE,
  ASSIGNMENT_UNIT,
  POST_EXPERIMENT_RULE,
  IEnrollmentCompleteCondition,
} from 'upgrade_types';
import { Query } from '../api/models/Query';

export class ExperimentInput {
  public id: string;

  @IsNotEmpty()
  public name: string;

  public description: string;

  public context: string[];

  @IsNotEmpty()
  public state: EXPERIMENT_STATE;

  public startDate: Date;

  @ValidateIf((o) => o.state === EXPERIMENT_STATE.SCHEDULED)
  @IsNotEmpty()
  public startOn: Date;

  @IsNotEmpty()
  public consistencyRule: CONSISTENCY_RULE;

  @IsNotEmpty()
  public assignmentUnit: ASSIGNMENT_UNIT;

  @IsNotEmpty()
  public postExperimentRule: POST_EXPERIMENT_RULE;

  public enrollmentCompleteCondition: Partial<IEnrollmentCompleteCondition>;

  public endOn: Date;

  public endDate: Date;

  public revertTo: string;

  public tags: string[];

  public group: string;

  public logging: boolean;

  @ValidateNested()
  public conditions: ExperimentCondition[];

  @ValidateNested()
  public partitions: ExperimentPartition[];

  @ValidateNested()
  public queries: Query[];

  public createdAt: Date;
  public updatedAt: Date;
  public versionNumber: number;
}
