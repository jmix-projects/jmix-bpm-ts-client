module.exports = {
  "coverageThreshold": {
    "global": {
      "statements": 80,
      "branches": 75,
      "functions": 60,
      "lines": 80
    }
  },
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Jmix BPM SDK Test Report"
    }]
  ]
};
