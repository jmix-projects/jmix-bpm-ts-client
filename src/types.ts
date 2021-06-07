export interface DataResponseProcessDefinitionResponse {
  data?: Array<ProcessDefinitionResponse>;
  total?: number;
  start?: number;
  sort?: string;
  order?: string;
  size?: number;
}

export interface ProcessDefinitionResponse {
  id?: string;
  url?: string;
  key?: string;
  version?: number;
  name?: string;
  description?: string;
  tenantId?: string;
  deploymentId?: string;
  deploymentUrl?: string;
  resource?: string;
  diagramResource?: string;
  category?: string;
  graphicalNotationDefined?: boolean;
  suspended?: boolean;
  startFormDefined?: boolean;
}

export interface ListProcessDefinitionsRequest {
  /** Only return process definitions with the given version. */
  version?: number;
  /** Only return process definitions with the given name. */
  name?: string;
  /** Only return process definitions with a name like the given name. */
  nameLike?: string;
  /** Only return process definitions with the given key. */
  key?: string;
  /** Only return process definitions with a name like the given key. */
  keyLike?: string;
  /** Only return process definitions with the given resource name. */
  resourceName?: string;
  /** Only return process definitions with a name like the given resource name. */
  resourceNameLike?: string;
  /** Only return process definitions with the given category. */
  category?: string;
  /** Only return process definitions with a category like the given name. */
  categoryLike?: string;
  /** Only return process definitions which do not have the given category. */
  categoryNotEquals?: string;
  /** Only return process definitions with the given category. */
  deploymentId?: string;
  /** Only return process definitions which are part of a deployment with the given id. */
  startableByUser?: string;
  /** Only return the latest process definition versions. Can only be used together with key and keyLike parameters, using any other parameter will result in a 400-response. */
  latest?: boolean;
  /** If true, only returns process definitions which are suspended. If false, only active process definitions (which are not suspended) are returned. */
  suspended?: boolean;
  /** Property to sort on, to be used together with the order. */
  sort?: "name" | "id" | "key" | "category" | "deploymentId" | "version";
}

export interface ListOfProcessInstancesRequest {
  /** Only return models with the given version. */
  id?: string;
  /** Only return models with the given name. */
  name?: string;
  /** Only return models like the given name. */
  nameLike?: string;
  /** Only return models like the given name ignoring case. */
  nameLikeIgnoreCase?: string;
  /** Only return process instances with the given process definition key. */
  processDefinitionKey?: string;
  /** Only return process instances with the given process definition id. */
  processDefinitionId?: string;
  /** Only return process instances with the given process definition category. */
  processDefinitionCategory?: string;
  /** Only return process instances with the given process definition version. */
  processDefinitionVersion?: number;
  /** Only return process instances with the given process definition engine version. */
  processDefinitionEngineVersion?: string;
  /** Only return process instances with the given businessKey. */
  businessKey?: string;
  /** Only return process instances with the businessKey like the given key. */
  businessKeyLike?: string;
  /** Only return process instances started by the given user. */
  startedBy?: string;
  /** Only return process instances started before the given date. */
  startedBefore?: string;
  /** Only return process instances started after the given date. */
  startedAfter?: string;
  /** Only return process instances in which the given user is involved. */
  involvedUser?: string;
  /** If true, only return process instance which are suspended. If false, only return process instances which are not suspended (active). */
  suspended?: boolean;
  /** Only return process instances which have the given super process-instance id (for processes that have a call-activities). */
  superProcessInstanceId?: string;
  /** Only return process instances which have the given sub process-instance id (for processes started as a call-activity). */
  subProcessInstanceId?: string;
  /** Return only process instances which are not sub processes. */
  excludeSubprocesses?: boolean;
  /** Indication to include process variables in the result. */
  includeProcessVariables?: boolean;
  /** Only return process instances with the given callbackId. */
  callbackId?: string;
  /** Only return process instances with the given callbackType. */
  callbackType?: string;
  /** Only return process instances with the given tenantId. */
  tenantId?: string;
  /** Only return process instances with a tenantId like the given value. */
  tenantIdLike?: string;
  /** If true, only returns process instances without a tenantId set. If false, the withoutTenantId parameter is ignored. */
  withoutTenantId?: boolean;
  /** Property to sort on, to be used together with the order. */
  sort?:
    | "id"
    | "processDefinitionId"
    | "tenantId"
    | "processDefinitionKey";
}

export interface DataResponseProcessInstanceResponse {
  data?: Array<ProcessInstanceResponse>;
  total?: number;
  start?: number;
  sort?: string;
  order?: string;
  size?: number;
}

export interface ProcessInstanceResponse {
  id?: string;
  url?: string;
  name?: string;
  businessKey?: string;
  suspended?: boolean;
  ended?: boolean;
  processDefinitionId?: string;
  processDefinitionUrl?: string;
  processDefinitionName?: string;
  processDefinitionDescription?: string;
  activityId?: string;
  startUserId?: string;
  startTime?: string;
  variables?: Array<RestVariable>;
  callbackId?: string;
  callbackType?: string;
  referenceId?: string;
  referenceType?: string;
  tenantId?: string;
  completed?: boolean;
}

export interface RestVariable {
  name?: string;
  type?: string;
  value?: any;
  valueUrl?: string;
  scope?: string;
}

/**
 * Only one of processDefinitionId, processDefinitionKey or message can be used in the request body
 */
export interface ProcessInstanceCreateRequest {
  processDefinitionId?: string;
  processDefinitionKey?: string;
  message?: string;
  name?: string;
  businessKey?: string;
  variables?: Array<RestVariable>;
  transientVariables?: Array<RestVariable>;
  startFormVariables?: Array<RestVariable>;
  outcome?: string;
  tenantId?: string;
  overrideDefinitionTenantId?: string;
  returnVariables?: boolean;
}

export interface TaskQueryRequest {
  start?: number;
  size?: number;
  sort?: string;
  order?: string;
  name?: string;
  nameLike?: string;
  description?: string;
  descriptionLike?: string;
  priority?: number;
  minimumPriority?: number;
  maximumPriority?: number;
  assignee?: string;
  assigneeLike?: string;
  owner?: string;
  ownerLike?: string;
  unassigned?: boolean;
  delegationState?: string;
  candidateUser?: string;
  candidateGroup?: string;
  candidateGroupIn?: Array<string>;
  involvedUser?: string;
  processInstanceId?: string;
  processInstanceIdWithChildren?: string;
  processInstanceBusinessKey?: string;
  processInstanceBusinessKeyLike?: string;
  processDefinitionId?: string;
  processDefinitionKey?: string;
  processDefinitionName?: string;
  processDefinitionKeyLike?: string;
  processDefinitionNameLike?: string;
  executionId?: string;
  createdOn?: Date;
  createdBefore?: Date;
  createdAfter?: Date;
  excludeSubTasks?: boolean;
  taskDefinitionKey?: string;
  taskDefinitionKeyLike?: string;
  taskDefinitionKeys?: Array<string>;
  dueDate?: Date;
  dueBefore?: Date;
  dueAfter?: Date;
  withoutDueDate?: boolean;
  active?: boolean;
  includeTaskLocalVariables?: boolean;
  includeProcessVariables?: boolean;
  scopeDefinitionId?: string;
  scopeId?: string;
  scopeType?: string;
  tenantId?: string;
  tenantIdLike?: string;
  withoutTenantId?: boolean;
  candidateOrAssigned?: string;
  category?: string;
  taskVariables?: Array<QueryVariable>;
  processInstanceVariables?: Array<QueryVariable>;
}

export interface QueryVariable {
  name?: string;
  operation?: QueryVariableNS.OperationEnum;
  value?: any;
  type?: string;
}

export namespace QueryVariableNS {
  export enum OperationEnum {
    Equals = <any>'equals',
    NotEquals = <any>'notEquals',
    EqualsIgnoreCase = <any>'equalsIgnoreCase',
    NotEqualsIgnoreCase = <any>'notEqualsIgnoreCase',
    Like = <any>'like',
    LikeIgnoreCase = <any>'likeIgnoreCase',
    GreaterThan = <any>'greaterThan',
    GreaterThanOrEquals = <any>'greaterThanOrEquals',
    LessThan = <any>'lessThan',
    LessThanOrEquals = <any>'lessThanOrEquals'
  }
}

export interface DataResponseTaskResponse {
  data?: Array<TaskResponse>;
  total?: number;
  start?: number;
  sort?: string;
  order?: string;
  size?: number;
}


export interface TaskResponse {
  id?: string;
  url?: string;
  owner?: string;
  assignee?: string;
  /** Delegation-state of the task, can be null, "pending" or "resolved". */
  delegationState?: string;
  name?: string;
  description?: string;
  createTime?: string;
  dueDate?: string;
  priority?: number;
  suspended?: boolean;
  claimTime?: string;
  taskDefinitionKey?: string;
  scopeDefinitionId?: string;
  scopeId?: string;
  subScopeId?: string;
  scopeType?: string;
  propagatedStageInstanceId?: string;
  tenantId?: string;
  category?: string;
  formKey?: string;
  parentTaskId?: string;
  parentTaskUrl?: string;
  executionId?: string;
  executionUrl?: string;
  processInstanceId?: string;
  processInstanceUrl?: string;
  processDefinitionId?: string;
  processDefinitionUrl?: string;
  variables?: Array<RestVariable>;
}

export interface DeploymentResponse {
  id?: string;
  name?: string;
  deploymentTime?: Date;
  category?: string;
  parentDeploymentId?: string;
  url?: string;
  tenantId?: string;
}

export interface TaskActionRequest {
  /** Action to perform: Either complete, claim, delegate or resolve */
  action: string;
  /** If action is claim or delegate, you can use this parameter to set the assignee associated */
  assignee?: string;
  /** Required when completing a task with a form */
  formDefinitionId?: string;
  /** Optional outcome value when completing a task with a form */
  outcome?: string;
  /** If action is complete, you can use this parameter to set variables */
  variables?: Array<RestVariable>;
  /** If action is complete, you can use this parameter to set transient variables */
  transientVariables?: Array<RestVariable>;
}

export interface ProcessDefinitionActionRequest {
  /**
   * Action to perform: Either activate or suspend
   */
  action: 'activate' | 'suspend';
  /**
   * Whether or not to suspend/activate running process-instances for this process-definition. If omitted, the process-instances are left in the state they are
   */
  includeProcessInstances?: boolean;
  /**
   * Date (ISO-8601) when the suspension/activation should be executed. If omitted, the suspend/activation is effective immediately.
   */
  date?: Date;
}

export interface RestIdentityLink {
  url?: string;
  user?: string;
  group?: string;
  type?: string;
}

export interface ProcessInstanceQueryRequest {
  start?: number;
  size?: number;
  sort?: string;
  order?: string;
  processInstanceId?: string;
  processInstanceIds?: Array<string>;
  processInstanceName?: string;
  processInstanceNameLike?: string;
  processInstanceNameLikeIgnoreCase?: string;
  processBusinessKey?: string;
  processBusinessKeyLike?: string;
  processDefinitionId?: string;
  processDefinitionIds?: Array<string>;
  processDefinitionKey?: string;
  processDefinitionKeys?: Array<string>;
  processDefinitionName?: string;
  processDefinitionCategory?: string;
  processDefinitionVersion?: number;
  processDefinitionEngineVersion?: string;
  deploymentId?: string;
  deploymentIdIn?: Array<string>;
  superProcessInstanceId?: string;
  subProcessInstanceId?: string;
  excludeSubprocesses?: boolean;
  involvedUser?: string;
  startedBy?: string;
  startedBefore?: Date;
  startedAfter?: Date;
  suspended?: boolean;
  includeProcessVariables?: boolean;
  variables?: Array<QueryVariable>;
  callbackId?: string;
  callbackType?: string;
  tenantId?: string;
  tenantIdLike?: string;
  withoutTenantId?: boolean;
}

