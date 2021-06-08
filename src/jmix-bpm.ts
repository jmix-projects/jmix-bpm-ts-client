import {base64encode, encodeGetParams, matchesVersion, getStringId} from "./util";
import {JmixRestError} from "./error";
import {DefaultStorage} from "./storage";

//Types
import {
  DataResponseProcessDefinitionResponse, DataResponseProcessInstanceResponse,
  DataResponseTaskResponse,
  DeploymentResponse,
  ListOfProcessInstancesRequest,
  ListProcessDefinitionsRequest,
  ProcessDefinitionActionRequest,
  ProcessDefinitionResponse,
  ProcessInstanceCreateRequest, ProcessInstanceQueryRequest,
  ProcessInstanceResponse, RestIdentityLink, RestVariable,
  TaskActionRequest,
  TaskQueryRequest
} from "./types";

interface LoginOptions {
  tokenEndpoint: string;
}

const throwNormalizedJmixRestError = (e: Error | JmixRestError) => {
  throw e.name === 'JmixRestError' ? e : new JmixRestError({message: e.message});
}

export interface FetchOptions extends RequestInit {
  handleAs?: ContentType;
}

type ContentType = "text" | "json" | "blob" | "raw" | 'multipart-form-data';

export class JmixBpm {

  private static REST_TOKEN_STORAGE_KEY = "jmixBpmAccessToken";
  private static BPM_PROCESS_API_URL_ROOT = "/bpm/api/process";

  constructor(public name = "",
              public jmixAppUrl: string,
              public restClientId = "client",
              public restClientSecret = "secret",
              private storage: Storage = new DefaultStorage()) {
  }

  get restApiToken(): string {
    return this.storage.getItem(this.name + "_" + JmixBpm.REST_TOKEN_STORAGE_KEY);
  }

  set restApiToken(token: string) {
    this.storage.setItem(this.name + "_" + JmixBpm.REST_TOKEN_STORAGE_KEY, token);
  }

  public loadProcessDefinitions(
    options?: ListProcessDefinitionsRequest
  ): Promise<DataResponseProcessDefinitionResponse> {
    return this.fetch('GET', "/repository/process-definitions", options, {handleAs: 'json'});
  }

  public executeProcessDefinitionAction(
    processDefinitionId: string,
    request: ProcessDefinitionActionRequest
  ): Promise<ProcessDefinitionResponse> {
    return this.fetch('PUT', `/repository/process-definitions/${processDefinitionId}`, JSON.stringify(request), {handleAs: 'json'});
  }

  public listProcessDefinitionIdentityLinks(
    processDefinitionId: string
  ): Promise<Array<RestIdentityLink>> {
    return this.fetch('GET', `/repository/process-definitions/${processDefinitionId}/identitylinks`, null, {handleAs: 'json'});
  }

  public loadProcessInstances(
    options?: ListOfProcessInstancesRequest
  ): Promise<DataResponseProcessInstanceResponse> {
    return this.fetch('GET', "/runtime/process-instances", options, {handleAs: 'json'});
  }

  public queryProcessInstances(
    request: ProcessInstanceQueryRequest
  ): Promise<DataResponseProcessInstanceResponse> {
    return this.fetch('POST', "/query/process-instances", JSON.stringify(request), {handleAs: 'json'});
  }

  public startProcessInstance(
    request: ProcessInstanceCreateRequest
  ): Promise<ProcessInstanceResponse> {
    return this.fetch('POST', "/runtime/process-instances", JSON.stringify(request), {handleAs: 'json'});
  }

  public queryTasks(
    request?: TaskQueryRequest
  ): Promise<DataResponseTaskResponse> {
    return this.fetch('POST', "/query/tasks", JSON.stringify(request), {handleAs: 'json'});
  }

  public executeTaskAction(
    taskId: string,
    request: TaskActionRequest
  ): Promise<Response> {
    return this.fetch('POST', `/runtime/tasks/${taskId}`, JSON.stringify(request));
  }

  public updateProcessInstanceVariables(
    processInstanceId: string,
    variables: Array<RestVariable>
  ): Promise<Response> {
    return this.fetch('PUT', `/runtime/process-instances/${processInstanceId}/variables`, JSON.stringify(variables));
  }

  public listProcessInstanceVariables(
    processInstanceId: string
  ): Promise<Array<RestVariable>> {
    return this.fetch('GET', `/runtime/process-instances/${processInstanceId}/variables`, null, {handleAs: 'json'});
  }

  /**
   * Logs in user and stores token in provided storage.
   * @param {string} login
   * @param {string} password
   * @param {LoginOptions} options You can use custom endpoints e.g. {tokenEndpoint:'ldap/token'}.
   * @returns {Promise<{access_token: string}>}
   */
  public login(login: string, password: string, options?: LoginOptions): Promise<{ access_token: string }> {
    if (login == null) {
      login = "";
    }
    if (password == null) {
      password = "";
    }
    const fetchOptions = {
      method: "POST",
      headers: this._getBasicAuthHeaders(),
      body: "grant_type=password&username=" + encodeURIComponent(login) + "&password=" + encodeURIComponent(password),
    };
    const endpoint = options && options.tokenEndpoint ? options.tokenEndpoint : '/oauth/token';
    const loginRes = fetch(this.jmixAppUrl + endpoint, fetchOptions)
      .then(JmixBpm.checkStatus)
      .then((resp) => resp.json())
      .then((data) => {
        this.restApiToken = data.access_token;
        return data;
      })
      .catch(throwNormalizedJmixRestError);
    return loginRes;
  }

  public fetch<T>(method: string, path: string, data?: any, fetchOptions?: FetchOptions): Promise<T> {
    let url = this.jmixAppUrl + JmixBpm.BPM_PROCESS_API_URL_ROOT + path;
    const settings: FetchOptions = {
      method,
      headers: {
        // "Accept-Language": this.locale,
      },
      ...fetchOptions,
    };
    if (this.restApiToken) {
      settings.headers["Authorization"] = "Bearer " + this.restApiToken;
    }
    if (method === 'POST' || method === 'PUT') {
      settings.body = data;
      settings.headers["Content-Type"] = "application/json; charset=UTF-8";
    }
    if (method === 'GET' && data && Object.keys(data).length > 0) {
      url += '?' + encodeGetParams(data);
    }
    const handleAs: ContentType = fetchOptions ? fetchOptions.handleAs : undefined;
    switch (handleAs) {
      case "text":
        settings.headers["Accept"] = "text/html";
        break;
      case "json":
        settings.headers["Accept"] = "application/json";
        break;
    }

    const fetchRes = fetch(url, settings).then(JmixBpm.checkStatus);
    return fetchRes
      .then((resp) => {
        if (resp.status === 204) {
          return resp.text();
        }
        switch (handleAs) {
          case "text":
            return resp.text();
          case "blob":
            return resp.blob();
          case "json":
            return resp.json();
          case "raw":
            return resp;
          default:
            return resp;
        }
      })
      .catch(throwNormalizedJmixRestError);
  }

  private static checkStatus(response: Response): any {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new JmixRestError({
        message: response.statusText,
        response,
      });
      return Promise.reject(error);
    }
  }

  private _getBasicAuthHeaders(): { [header: string]: string } {
    return getBasicAuthHeaders(this.restClientId, this.restClientSecret);
  }

}

export function getBasicAuthHeaders(client: string, secret: string, locale = 'en'): { [header: string]: string } {
  return {
    "Accept-Language": locale,
    "Authorization": "Basic " + base64encode(client + ':' + secret),
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
}

//todo
// async createDeployment(
//   file: File
// ): Promise<DeploymentResponse> {
//   let formData = new FormData();
//   // let blob = new Blob([fileContent]);
//   // const file = new File([blob], 'file1.bpmn20.xml');
//   formData.append("file", file, "file.bpmn20.xml");
//   // return this.fetch('POST', '/repository/deployments', formData, {requestContentType: 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'});
//   const response = await fetch('http://localhost:8080/bpm/api/process/repository/deployments', {
//     method: 'POST',
//     headers: {
//       // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
//       // 'Content-Type': undefined,
//       'Authorization': `Bearer ${this.restApiToken}`,
//       'Accept': 'application/json'
//     },
//     body: formData
//   })
//     .then()
//   return response.json();
// }
