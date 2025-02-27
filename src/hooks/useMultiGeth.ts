import ERPC from "@etclabscore/ethereum-json-rpc";
import JadeServiceRunner from "@etclabscore/jade-service-runner-client";
import React, { useState, Dispatch } from "react";

const serviceName = "multi-geth";

function useMultiGeth(
  serviceRunner: JadeServiceRunner | undefined,
  serviceRunnerUrl: string,
  version: string,
  env: string,
  queryUrlOverride?: string,
): [ERPC, Dispatch<string>] {
  const [erpc, setErpc] = React.useState();
  const [urlOverride, setUrlOverride] = useState(process.env.REACT_APP_ETH_RPC_URL);
  React.useEffect(() => {
    if (!serviceRunner) {
      return;
    }
    const runAsync = async () => {
      const installed = await serviceRunner.installService(serviceName, version);
      if (!installed) {
        return;
      }
      await serviceRunner.startService(serviceName, version, env);
      let parsedUrl;
      try {
        parsedUrl = new URL(queryUrlOverride || urlOverride || `${serviceRunnerUrl}/${serviceName}/${env}/${version}`);
      } catch (e) {
        return;
      }
      let rpc;
      try {
        const protocol = parsedUrl.protocol.split(":")[0] as any;
        const fallbackPort = protocol === "http" ? 80 : 443;
        const port = parseInt(parsedUrl.port, 10);
        rpc = new ERPC({
          transport: {
            host: parsedUrl.hostname,
            port: port ? port : fallbackPort,
            type: protocol,
            path: parsedUrl.pathname,
          },
        });
      } catch (e) {
        return;
      }
      if (rpc) {
        setErpc(rpc);
      }
    };
    runAsync();
  }, [serviceRunner, serviceRunnerUrl, version, env, urlOverride, queryUrlOverride]);
  return [erpc, setUrlOverride];
}

export default useMultiGeth;
