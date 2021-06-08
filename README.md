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

#### Configure Jmix Application

In order to run integration tests you need to have a Jmix project running at `http://localhost:8080`.

Steps to configure the Jmix project:

1. Create new Jmix project
1. Add the following starters in the build.gradle file:
```groovy
    implementation "io.jmix.bpm:jmix-bpm-starter"
    implementation "io.jmix.bpm:jmix-bpm-ui-starter"
    implementation "io.jmix.bpm:jmix-bpm-rest-starter"
    implementation "io.jmix.security:jmix-security-oauth2-starter"
```
3. Start the project
3. Assign the **bpm-rest-api** role to the user **admin**
3. Open the **BPM - User Groups** screen and create a new user group there. Group code is `all`, group type is `All users`
3. Open the **BPM - Process Definitions** screen and upload the process using the **Upload BPMN XML** button. The process file is located here: [resources/ts-test-process.bpmn20.xml](resources/ts-test-process.bpmn20.xml).

#### Run Tests

To run integration tests use the following command:

```bash
npm run test
```