import Container from 'typedi';
import { ExperimentService } from '../../../../src/api/services/ExperimentService';
import { individualAssignmentExperiment } from '../../mockData/experiment/index';
import { UserService } from '../../../../src/api/services/UserService';
import { getRepository } from 'typeorm';
import { Metric } from '../../../../src/api/models/Metric';
import { systemUser } from '../../mockData/user/index';
import { ExperimentAssignmentService } from '../../../../src/api/services/ExperimentAssignmentService';
import { experimentUsers } from '../../mockData/experimentUsers/index';
import { EXPERIMENT_STATE, OPERATION_TYPES } from 'upgrade_types';
import { getAllExperimentCondition } from '../../utils';
import { checkExperimentAssignedIsNotDefault } from '../../utils/index';
import { MetricService, METRICS_JOIN_TEXT } from '../../../../src/api/services/MetricService';
import { SettingService } from '../../../../src/api/services/SettingService';
import { QueryService } from '../../../../src/api/services/QueryService';
import { metrics } from '../../mockData/metric';

export default async function CreateLog(): Promise<void> {
  const experimentService = Container.get<ExperimentService>(ExperimentService);
  const experimentAssignmentService = Container.get<ExperimentAssignmentService>(ExperimentAssignmentService);
  let experimentObject = individualAssignmentExperiment;
  const userService = Container.get<UserService>(UserService);
  const metricRepository = getRepository(Metric);
  const metricService = Container.get<MetricService>(MetricService);
  const settingService = Container.get<SettingService>(SettingService);
  const queryService = Container.get<QueryService>(QueryService);

  const user = await userService.create(systemUser as any);

  // create experiment
  await experimentService.create(experimentObject as any, user);
  let experiments = await experimentService.find();
  expect(experiments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: experimentObject.name,
        state: experimentObject.state,
        postExperimentRule: experimentObject.postExperimentRule,
        assignmentUnit: experimentObject.assignmentUnit,
        consistencyRule: experimentObject.consistencyRule,
      }),
    ])
  );

  const experimentName = experimentObject.partitions[0].expId;
  const experimentPoint = experimentObject.partitions[0].expPoint;

  await settingService.setClientCheck(false, true);

  await metricService.saveAllMetrics(metrics as any);

  const findMetric = await metricRepository.find();
  expect(findMetric.length).toEqual(3);

  // change experiment status to Enrolling
  const experimentId = experiments[0].id;
  await experimentService.updateState(experimentId, EXPERIMENT_STATE.ENROLLING, user);

  // fetch experiment
  experiments = await experimentService.find();
  expect(experiments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: experimentObject.name,
        state: EXPERIMENT_STATE.ENROLLING,
        postExperimentRule: experimentObject.postExperimentRule,
        assignmentUnit: experimentObject.assignmentUnit,
        consistencyRule: experimentObject.consistencyRule,
      }),
    ])
  );

  // get all experiment condition for user 1
  let experimentConditionAssignments = await getAllExperimentCondition(experimentUsers[0].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // get all experiment condition for user 2
  experimentConditionAssignments = await getAllExperimentCondition(experimentUsers[1].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // get all experiment condition for user 3
  experimentConditionAssignments = await getAllExperimentCondition(experimentUsers[2].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // get all experiment condition for user 4
  experimentConditionAssignments = await getAllExperimentCondition(experimentUsers[3].id);
  checkExperimentAssignedIsNotDefault(experimentConditionAssignments, experimentName, experimentPoint);

  // Save queries for various operations
  const querySum = makeQuery('totalProblemsCompleted', OPERATION_TYPES.SUM, experiments[0].id);

  const queryMin = makeQuery('totalProblemsCompleted', OPERATION_TYPES.MIN, experiments[0].id);

  const queryMax = makeQuery('totalProblemsCompleted', OPERATION_TYPES.MAX, experiments[0].id);

  const queryAvg = makeQuery('totalProblemsCompleted', OPERATION_TYPES.AVERAGE, experiments[0].id);

  const queryCount = makeQuery('totalProblemsCompleted', OPERATION_TYPES.COUNT, experiments[0].id);

  const queryMode = makeQuery('totalProblemsCompleted', OPERATION_TYPES.MODE, experiments[0].id);

  const queryMedian = makeQuery('totalProblemsCompleted', OPERATION_TYPES.MEDIAN, experiments[0].id);

  const queryStddev = makeQuery('totalProblemsCompleted', OPERATION_TYPES.STDEV, experiments[0].id);

  // Deep state queries
  const deepQuerySum = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
    OPERATION_TYPES.SUM,
    experiments[0].id
  );

  const deepQueryAvg = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
    OPERATION_TYPES.AVERAGE,
    experiments[0].id
  );

  const deepQueryMin = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
    OPERATION_TYPES.MIN,
    experiments[0].id
  );

  const deepQueryMax = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
    OPERATION_TYPES.MAX,
    experiments[0].id
  );

  const deepQueryCount = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
    OPERATION_TYPES.COUNT,
    experiments[0].id
  );

  const deepQueryMedian = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
    OPERATION_TYPES.MEDIAN,
    experiments[0].id
  );

  const deepQueryMode = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
    OPERATION_TYPES.MODE,
    experiments[0].id
  );

  const deepQueryStddev = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
    OPERATION_TYPES.STDEV,
    experiments[0].id
  );

  // Deep state queries for categorical data
  const deepQueryCatSum = makeQuery(
    `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}completion`,
    OPERATION_TYPES.COUNT,
    experiments[0].id
  );

  experimentObject = {
    ...experimentObject,
    queries: [
      querySum,
      queryMin,
      queryMax,
      queryAvg,
      queryCount,
      queryMode,
      queryMedian,
      queryStddev,
      deepQuerySum,
      deepQueryAvg,
      deepQueryMin,
      deepQueryMax,
      deepQueryCount,
      deepQueryMedian,
      deepQueryMode,
      deepQueryStddev,
      deepQueryCatSum,
    ],
  };

  await experimentService.update(experimentObject.id, experimentObject as any, user);

  // log data here
  await experimentAssignmentService.dataLog(experimentUsers[0].id, {
    totalProblemsCompleted: 20,
    masteryWorkspace: { calculating_area_figures: { timeSeconds: 100, completion: 'GRADUATED' } },
  });

  await experimentAssignmentService.dataLog(experimentUsers[1].id, {
    totalProblemsCompleted: 200,
    masteryWorkspace: { calculating_area_figures: { timeSeconds: 200, completion: 'GRADUATED' } },
  });

  await experimentAssignmentService.dataLog(experimentUsers[2].id, {
    totalProblemsCompleted: 100,
    masteryWorkspace: { calculating_area_figures: { timeSeconds: 300, completion: 'PROMOTED' } },
  });

  await experimentAssignmentService.dataLog(experimentUsers[3].id, {
    totalProblemsCompleted: 50,
    masteryWorkspace: { calculating_area_figures: { timeSeconds: 400, completion: 'GRADUATED' } },
  });

  await experimentAssignmentService.dataLog(experimentUsers[3].id, {
    totalProblemsCompleted: 50,
    masteryWorkspace: { calculating_area_figures: { timeSeconds: 500, completion: 'PROMOTED' } },
  });

  const allQuery = await queryService.find();
  expect(allQuery).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.SUM },
        metric: expect.objectContaining({
          key: 'totalProblemsCompleted',
          type: 'continuous',
          allowedData: null,
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.AVERAGE },
        metric: expect.objectContaining({
          key: 'totalProblemsCompleted',
          type: 'continuous',
          allowedData: null,
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.COUNT },
        metric: expect.objectContaining({
          key: 'totalProblemsCompleted',
          type: 'continuous',
          allowedData: null,
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.MAX },
        metric: expect.objectContaining({
          key: 'totalProblemsCompleted',
          type: 'continuous',
          allowedData: null,
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.MIN },
        metric: expect.objectContaining({
          key: 'totalProblemsCompleted',
          type: 'continuous',
          allowedData: null,
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.MEDIAN },
        metric: expect.objectContaining({
          key: 'totalProblemsCompleted',
          type: 'continuous',
          allowedData: null,
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.MODE },
        metric: expect.objectContaining({
          key: 'totalProblemsCompleted',
          type: 'continuous',
          allowedData: null,
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.STDEV },
        metric: expect.objectContaining({
          key: 'totalProblemsCompleted',
          type: 'continuous',
          allowedData: null,
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.SUM },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
          type: 'continuous',
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.AVERAGE },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
          type: 'continuous',
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.COUNT },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
          type: 'continuous',
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.MAX },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
          type: 'continuous',
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.MIN },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
          type: 'continuous',
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.MEDIAN },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
          type: 'continuous',
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.MODE },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
          type: 'continuous',
        }),
      }),
      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.STDEV },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}timeSeconds`,
          type: 'continuous',
        }),
      }),

      expect.objectContaining({
        name: 'query',
        query: { operationType: OPERATION_TYPES.COUNT },
        metric: expect.objectContaining({
          key: `masteryWorkspace${METRICS_JOIN_TEXT}calculating_area_figures${METRICS_JOIN_TEXT}completion`,
          type: 'categorical',
          allowedData: ['GRADUATED', 'PROMOTED'],
        }),
      }),
    ])
  );

  // log data here
  await experimentAssignmentService.dataLog(experimentUsers[0].id, {
    time: 20,
    w: { time: '100', completion: 'InProgress' },
  });

  await experimentAssignmentService.dataLog(experimentUsers[1].id, {
    time: 200,
    w: { time: 200, completion: 'InProgress' },
  });

  await experimentAssignmentService.dataLog(experimentUsers[2].id, {
    time: 100,
    w: { time: 300, completion: 'Complete' },
  });

  await experimentAssignmentService.dataLog(experimentUsers[3].id, {
    time: 50,
    w: { time: 400, completion: 'InProgress' },
  });

  await experimentAssignmentService.dataLog(experimentUsers[3].id, {
    time: 50,
    w: { time: 500, completion: 'Complete' },
  });

  // Test results
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < allQuery.length; i++) {
    const query = allQuery[i];
    const queryResult = await queryService.analyse(query.id);
    const res = reduceResult(queryResult);
    let expectedValue;
    // Used for console output
    const consoleString =
      query.metric.key === 'totalProblemsCompleted'
        ? query.query.operationType + ' '
        : query.query.operationType + ' deep';

    switch (query.query.operationType) {
      case OPERATION_TYPES.SUM:
        const sum = res.reduce((accu, data) => {
          return accu + data;
        }, 0);
        expectedValue = 420;
        if (query.metric.key !== 'totalProblemsCompleted') {
          expectedValue = 1500; // For completion metric
        }
        expect(sum).toEqual(expectedValue);
        break;
      case OPERATION_TYPES.MIN:
        const minValue = Math.min(...res);
        expectedValue = 20;
        if (query.metric.key !== 'totalProblemsCompleted') {
          expectedValue = 100; // For completion metric
        }
        expect(minValue).toEqual(expectedValue);
        break;
      case OPERATION_TYPES.MAX:
        const maxValue = Math.max(...res);
        expectedValue = 200;
        if (query.metric.key !== 'totalProblemsCompleted') {
          expectedValue = 500; // For completion metric
        }
        expect(maxValue).toEqual(expectedValue);
        break;
      // Can not check exact values for below operations
      case OPERATION_TYPES.COUNT:
        console.log(consoleString, queryResult);

        const count = res.reduce((accu, data) => {
          return accu + data;
        }, 0);
        expect(count).toEqual(5);
        break;
      case OPERATION_TYPES.AVERAGE:
        console.log(consoleString, queryResult);
        break;
      case OPERATION_TYPES.MODE:
        console.log(consoleString, queryResult);
        break;
      case OPERATION_TYPES.MEDIAN:
        console.log(consoleString, queryResult);
        break;
      case OPERATION_TYPES.STDEV:
        console.log(consoleString, queryResult);
        break;
      default:
        break;
    }
  }
}

function makeQuery(metric: string, operationType: OPERATION_TYPES, experimentId: string): any {
  return {
    name: 'query',
    query: {
      operationType,
    },
    metric: {
      key: metric,
    },
    experimentId,
  };
}

function reduceResult(result: any): number[] {
  const resultSet = [];
  result.forEach((data) => {
    resultSet.push(parseInt(data.result, 10));
  });
  return resultSet;
}
