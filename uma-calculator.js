//
// Step 1: change this regular expression to match your UMA daemonset agents
//
function getAgentRegex() {
    return "(.*)\\|(.*)\\|(AppContainerMonitor|Kubernetes Agent)";
    //return "(.*)\\|Kubernetes Agent";
}

function execute(metricData,javascriptResultSetHelper) {

    // Step 2: do you want a summary logged at every calculator execution (every 15 seconds?)
    var logSummary = true;

    // Step 3: set to 1 to log debug messages at level DEBUG into IntroscopeEnterpriseManager.log
    var DEBUG = 0;

    //
    // DO NOT CHANGE ANYTHING BELOW THIS LINE!
    //

    var memoryUsage    = {};
    var memoryRequest  = {};
    var memoryLimit    = {};
    var cpuUtilization = {};
    var cpuRequest     = {};
    var cpuLimit       = {};
    var createdCount   = 0;

    if (logSummary) {
      log.info("calculator uma-calculators.js started with " + metricData.length + " metrics");
    }

    // for every matching metric
    for (var i = 0; i < metricData.length; i++) {
        var metric = metricData[i].agentMetric.attributeURL;
        var agent = metricData[i].agentName.processURL;
        var value = metricData[i].timeslicedValue.value;
        var frequency = metricData[i].frequency;

        var indexOfColon = metric.indexOf(":");
        var metricPath = metric.substring(0, indexOfColon);
        var metricName = agent + "|" + metricPath;

        if (DEBUG) { log.debug("init " + agent + "|" + metric + " = " + value); }

        // store metric in appropriate set
        if (metric.endsWith(":Memory Usage (Bytes)")) {
            memoryUsage[metricName] = value;
        } else if (metric.endsWith(":Memory Request (Bytes)")) {
            memoryRequest[metricName] = value;
        } else if (metric.endsWith(":Memory Limit (Bytes)")) {
            memoryLimit[metricName] = value;
        } else if (metric.endsWith(":CPU Utilization (mCore)")) {
            cpuUtilization[metricName] = value;
        } else if (metric.endsWith(":CPU Request (mCore)")) {
            cpuRequest[metricName] = value;
        } else if (metric.endsWith(":CPU Limit (mCore)")) {
            cpuLimit[metricName] = value;
        }
    }

    // create all memory % metrics
    for (metricName in memoryUsage) {
      value = 0;
      if (memoryLimit[metricName] > 0) {
        value = 100 * memoryUsage[metricName] / memoryLimit[metricName];
      }
      if (DEBUG) { log.debug("creating metric " + metricName + ":Memory Limit Used (%) = " + value); }
      javascriptResultSetHelper.addMetric(
          metricName + ":Memory Limit Used (%)",
          value,
          javascriptResultSetHelper.kIntegerPercentage,
          frequency
      );
      createdCount++;

      value = 0;
      if (memoryRequest[metricName] > 0) {
        value = 100 * memoryUsage[metricName] / memoryRequest[metricName];
      }
      if (DEBUG) { log.debug("creating metric " + metricName + ":Memory Request Used (%) = " + value); }
      javascriptResultSetHelper.addMetric(
          metricName + ":Memory Request Used (%)",
          value,
          javascriptResultSetHelper.kIntegerPercentage,
          frequency
      );
      createdCount++;
    }

    // create all cpu % metrics
    for (metricName in cpuUtilization) {
      value = 0;
      if (cpuLimit[metricName] > 0) {
        value = 100 * cpuUtilization[metricName] / cpuLimit[metricName];
      }
      if (DEBUG) { log.debug("creating metric " + metricName + ":CPU Limit Used (%) = " + value); }
      javascriptResultSetHelper.addMetric(
          metricName + ":CPU Limit Used (%)",
          value,
          javascriptResultSetHelper.kIntegerPercentage,
          frequency
      );
      createdCount++;

      value = 0;
      if (cpuRequest[metricName] > 0) {
        value = 100 * cpuUtilization[metricName] / cpuRequest[metricName];
      }
      if (DEBUG) { log.debug("creating metric " + metricName + ":CPU Request Used (%) = " + value); }
      javascriptResultSetHelper.addMetric(
          metricName + ":CPU Request Used (%)",
          value,
          javascriptResultSetHelper.kIntegerPercentage,
          frequency
      );
      createdCount++;
    }

    if (logSummary) {
      log.info("calculator uma-calculators.js created " + createdCount + " metrics");
    }

    return javascriptResultSetHelper;
}

function getMetricRegex() {
    // Include only Memory Usage, Memory Limit, Memory Request, CPU Utilization, CPU Limit, CPU Request of pods and containers
    //Kubernetes|Namespaces|cppm10039-dev|Pods|clarity-adminsrv-deployment-5478999bdb-zmgxq|Containers|admin-container:Memory Limit (Bytes)
    return "Kubernetes\\|Namespaces\\|.*\\|(Pods|Containers)\\|[^\\|]*:(Memory|CPU)\ (Usage|Utilization|Limit|Request)\ \\((Bytes|mCore)\\)";
}

// must return a multiple of default system frequency (currently 15 seconds)
function getFrequency() {
    return 1 * Packages.com.wily.introscope.spec.metric.Frequency.kDefaultSystemFrequencyInSeconds;
}

// Always set to false in case of SaaS
function runOnMOM() {
    return false;
}
