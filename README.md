# Jmix BPM TypeScript SDK

JavaScript library for web and Node.js which facilitates Jmix BPM REST API usage.
 
## Installation

### npm

```bash
npm install @haulmont/jmix-bpm-typescript-sdk --save
```
Import as module  
```javascript
const jmixBpm = require('@haulmont/jmix-bpm-typescript-sdk');
```

Or using ES6 imports:

```javascript
import {JmixBpm} from '@haulmont/jmix-bpm-typescript-sdk';
```

## Dependencies and requirements
Library has no external dependencies. It's assumed that `Promise` and `fetch` -compatible API are available 
or polyfilled i.e. in node environment:
  
```bash
npm install node-fetch --save
```

```javascript
global.fetch = require('node-fetch');
```

## Usage

```javascript
import {JmixBpm} from '@haulmont/jmix-bpm-typescript-sdk';

const jmixApp = new JmixApp('app', 'http://localhost:8080');
const tasks = await jmixBpm.queryTasks({
  assignee: 'admin'
});
```

## Development

### Tests
In order to run integration tests you need to have a Jmix project running at `http://localhost:8080`. 

BPM add-on must be added to the project, and the test process must be deployed. The process model file is [resources/ts-test-process.bpmn20.xml](resources/ts-test-process.bpmn20.xml). Also, the user group with the code **all** and the **All users** type must be created in the test project.