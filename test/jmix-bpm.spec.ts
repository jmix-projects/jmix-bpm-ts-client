import nodeFetch from 'node-fetch';
import {JmixBpm} from "../dist-node/jmix-bpm";
import {QueryVariableNS} from "../dist-node/types";

global.fetch = nodeFetch;

const JMIX_APP_URL = 'http://localhost:8080';
const TS_TEST_PROCESS_KEY = 'ts-test-process';

let jmixBpm;

describe('Jmix BPM TypeScript SDK e2e tests', function () {

  beforeAll(() => {
    jmixBpm = new JmixBpm("app", JMIX_APP_URL);
    return jmixBpm.login('admin', 'admin');
  })

  describe('process definitions', () => {
    test('list process definitions', async () => {
      const processDefinitionsResponse = await jmixBpm.loadProcessDefinitions({});

      let filteredProcessDefinitions = processDefinitionsResponse.data.filter((value) => value.key === TS_TEST_PROCESS_KEY);
      expect(filteredProcessDefinitions.length).toBeGreaterThan(0);
    });

    test('get candidate starters for process definition', async () => {
      //get process definition
      const processDefinitionsResponse = await jmixBpm.loadProcessDefinitions({});
      let processDefinition = processDefinitionsResponse.data.filter((value) => value.key === TS_TEST_PROCESS_KEY)[0];

      let restIdentityLinks = await jmixBpm.listProcessDefinitionIdentityLinks(processDefinition.id);
      expect(restIdentityLinks.length).toBeGreaterThan(0);
      expect(restIdentityLinks[0].group).toBe('all');
    });

    test('suspend and activate process definition', async () => {
      //get process definition
      const processDefinitionsResponse = await jmixBpm.loadProcessDefinitions({});
      let processDefinition = processDefinitionsResponse.data.filter((value) => value.key === TS_TEST_PROCESS_KEY)[0];

      //suspend the process definition
      let processDefinitionResponse = await jmixBpm.executeProcessDefinitionAction(processDefinition.id, {
        action: 'suspend'
      });
      expect(processDefinitionResponse.suspended).toBe(true);

      //activate the process definition
      processDefinitionResponse = await jmixBpm.executeProcessDefinitionAction(processDefinition.id, {
        action: 'activate'
      });
      expect(processDefinitionResponse.suspended).toBe(false);
    });
  });

  describe('process instances', () => {
    test('start process instance', async () => {
      const processInstancesResponse = await jmixBpm.startProcessInstance({
        processDefinitionKey: TS_TEST_PROCESS_KEY,
        variables: [
          {
            name: 'executor',
            value: 'admin'
          }
        ]
      });
      expect(processInstancesResponse.processDefinitionName).toBe("TS Test Process");
    });

    test('load process instance', async () => {
      const processInstancesResponse = await jmixBpm.loadProcessInstances({});
      expect(processInstancesResponse.data.length).toBeGreaterThan(0);
    });

    test('query process instances', async () => {
      let response = await jmixBpm.queryProcessInstances({
        variables: [
          {
            name: 'executor',
            operation: QueryVariableNS.OperationEnum.Equals,
            value: 'admin'
          }
        ]
      });
      expect(response.data.length).toBeGreaterThan(0);

      //query non-existing process instances
      response = await jmixBpm.queryProcessInstances({
        variables: [
          {
            name: 'executor',
            operation: QueryVariableNS.OperationEnum.Equals,
            value: 'admin1'
          }
        ]
      });
      expect(response.data.length).toBe(0);
    });
  });

  describe('tasks', () => {
    test('query tasks', async () => {
      const response = await jmixBpm.queryTasks({
        assignee: 'admin'
      });
    });

    test('complete task', async () => {
      const assignedTasksResponse = await jmixBpm.queryTasks({
        assignee: 'admin'
      });
      const task = assignedTasksResponse.data[0];
      const taskActionResponse = await jmixBpm.executeTaskAction(
        task.id,
        {
          action: 'complete'
        });
      expect(taskActionResponse.status).toBe(200);
    });
  });

  describe('process variables', () => {

    const startTestProcessInstance = () => {
      return jmixBpm.startProcessInstance({
        processDefinitionKey: TS_TEST_PROCESS_KEY,
        variables: [
          {
            name: 'executor',
            value: 'admin'
          }
        ]
      });
    }

    test('update process instance variable', async () => {
      const processInstanceResponse = await startTestProcessInstance();
      const variables = [
        {
          name: 'var1',
          type: 'string',
          value: 'someValue'
        },
        {
          name: 'var2',
          type: 'integer',
          value: 1
        },
      ];
      let variablesResponse = await jmixBpm.updateProcessInstanceVariables(processInstanceResponse.id, variables);
      expect(variablesResponse.ok).toBeTruthy();
    });

    test('get process instance variable', async () => {
      const processInstanceResponse = await startTestProcessInstance();
      const variables = [
        {
          name: 'var1',
          type: 'string',
          value: 'someValue'
        }];
      await jmixBpm.updateProcessInstanceVariables(processInstanceResponse.id, variables);

      const restVariables = await jmixBpm.listProcessInstanceVariables(processInstanceResponse.id);
      expect(restVariables.length).toBe(3);
      const var1 = restVariables.find((value) => {
        return value.name === 'var1';
      });
      expect(var1.value).toBe('someValue');
    });

  });
});
