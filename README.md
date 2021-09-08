# UMA uma-calculator

# Description
A javascript calculator that calculates the memory and cpu request and limit usage for UMA.

## Short Description
A javascript calculator that calculates the memory and cpu request and limit usage for UMA.

## APM version
CA APM 10.7, 20.x, 21.x, SaaS
UMA (Universal Monitoring Agent for Kubernetes) 11.x, 20.x, 21.x

## Supported third party versions
n/a

## License
[Apache License v 2.0](LICENSE)

# Installation Instructions

## Prerequisites
UMA (Universal Monitoring Agent for Kubernetes) deploys several pods to monitor a Kubernetes cluster. It deploys one DaemonSet pod on each node in the cluster that reports as an agent that is usually called `<node>|<cluster>|(AppContainerMonitor|Kubernetes Agent)`. You can override the agent name in the UMA deployment. Make sure that the regular expression the function `getAgentRegex()` matches your agent names. The default is:
```
function getAgentRegex() {
    return "(.*)\\|(.*)\\|(AppContainerMonitor|Kubernetes Agent)";
}
```

## Dependencies
* CA APM 10.7, 20.x, 21.x, SaaS
* UMA (Universal Monitoring Agent for Kubernetes) 11.x, 20.x, 21.x

## Configuration
n/a

## Installation
If `introscope.enterprisemanager.javascript.hotdeploy.collectors.enable` in `<EM_HOME>/config/IntroscopeEnterpriseManager.properties` is set to `true` (which is the default), a script that is deployed on the MOM is automatically propagated to its collectors.

* If `introscope.enterprisemanager.javascript.hotdeploy.collectors.enable` is `false` you can either set it `false` or you have to manually copy `uma-calculator.js` to all collectors.

To install copy `uma-calculator.js` to `<EM_HOME>/scripts/`.

The Introscope Enterprise Manager will read the new script file within 60 seconds and log the following messages to `IntroscopeEnterpriseManager.log`. If you see an error message you probably have a syntax error in the code you changed.
```
4/03/20 09:47:09.762 AM GMT [INFO] [TimerBean] [Manager.JavaScriptCalculator] Deploying JavaScript calculator /opt/CA/Introscope/./scripts/uma-calculator.js
4/03/20 09:47:09.763 AM GMT [INFO] [TimerBean] [Manager.JavascriptEngine] Initializing script from /opt/CA/Introscope/./scripts/uma-calculator.js
4/03/20 09:47:09.784 AM GMT [INFO] [TimerBean] [Manager.JavaScriptCalculator] Successfully added script /opt/CA/Introscope/./scripts/uma-calculator.js
```

# Usage Instructions

## Metric description
The javascript calculator will create the following new metrics for each monitored pod and container:
* `Memory Limit Used (%)`: `Memory Usage (Bytes)` / `Memory Limit (Bytes)` * 100
* `Memory Request Used (%)`: `Memory Usage (Bytes)` / `Memory Request (Bytes)` * 100
* `CPU Limit Used (%)`: `CPU Utilization (mCore)` / `CPU Limit (mCore)` * 100
* `CPU Request Used (%)`: `CPU Utilization (mCore)` / `CPU Request (mCore)` * 100

## Debugging and Troubleshooting
If you want to have two messages logged to `IntroscopeEnterpriseManager.log` for every execution (every 15 seconds) set `var logSummary = true;`. The log messages will look like these:
```
4/03/20 09:50:15.028 AM GMT [INFO] [master clock] [Manager.JavaScript|uma-calculator.js] calculator uma-calculator.js started with 390 metrics
4/03/20 09:50:15.042 AM GMT [INFO] [master clock] [Manager.JavaScript|uma-calculator.js] calculator uma-calculator.js created 840 metrics
```
Use the number of metrics in the *start* message to make sure you send as few metrics as possible to the calculator. You can also calculate the time the calculator ran, e.g. 14ms in the above example.

To debug the calculator you can set `var DEBUG = 1;` in `uma-calculator.js`. This will log several messages per metric (!) to `IntroscopeEnterpriseManager.log` at log level DEBUG.

The log level `DEBUG` is not configured for `IntroscopeEnterpriseManager.log` by default and you don't want to set the log level to `DEBUG` for the whole Enterprise Manager as it might have a performance impact. Therefore, we recommend to send the logs of the javascript calculator to a separate file by adding this log configuration to your `config/IntroscopeEnterpriseManager.properties`:
```
log4j.logger.Manager.JavaScript|uma-calculator.js=DEBUG,jclogfile1
log4j.appender.jclogfile1.File=logs/PAPIM-Aggregation.js.log
log4j.appender.jclogfile1=com.wily.org.apache.log4j.RollingFileAppender
log4j.appender.jclogfile1.layout=com.wily.org.apache.log4j.PatternLayout
log4j.appender.jclogfile1.layout.ConversionPattern=%d{M/dd/yy hh:mm:ss.SSS a z} [%-3p] %m%n
log4j.appender.jclogfile1.MaxBackupIndex=4
log4j.appender.jclogfile1.MaxFileSize=10MB
```

## Support
This document and associated tools are made available from CA Technologies, A Broadcom Company as examples and provided at no charge as a courtesy to the CA APM Community at large. This resource may require modification for use in your environment. However, please note that this resource is not supported by CA Technologies, and inclusion in this site should not be construed to be an endorsement or recommendation by CA Technologies. These utilities are not covered by the CA Technologies software license agreement and there is no explicit or implied warranty from CA Technologies. They can be used and distributed freely amongst the CA APM Community, but not sold. As such, they are unsupported software, provided as is without warranty of any kind, express or implied, including but not limited to warranties of merchantability and fitness for a particular purpose. CA Technologies does not warrant that this resource will meet your requirements or that the operation of the resource will be uninterrupted or error free or that any defects will be corrected. The use of this resource implies that you understand and agree to the terms listed herein.

Although these utilities are unsupported, please let us know if you have any problems or questions by adding a comment to the CA APM Community Site area where the resource is located, so that the Author(s) may attempt to address the issue or question.

Unless explicitly stated otherwise this extension is only supported on the same platforms as the APM core agent. See [APM Compatibility Guide](https://techdocs.broadcom.com/us/product-content/status/compatibility-matrix/application-performance-management-compatibility-guide.html).

### Support URL
https://github.com/CA-APM/ca-apm-uma-calculator/issues

# Contributing
The [DX APM Community](https://community.broadcom.com/enterprisesoftware/communities/communityhomeblogs?CommunityKey=be08e336-5d32-4176-96fe-a778ffe72115) is the primary means of interfacing with other users and with the CA APM product team.

If you wish to contribute to this or any other project, check us out on [GitHub](https://github.com/CA-APM) or in the [DX APM Community](https://community.broadcom.com/enterprisesoftware/communities/communityhomeblogs?CommunityKey=be08e336-5d32-4176-96fe-a778ffe72115).

## Categories
Integration


# Change log
Changes for each version of the extension.

Version | Author | Comment
--------|--------|--------
1.0 | CA Technologies | First version of the extension.
