import { useState } from "react";
import cogoToast from "cogo-toast";

const enigma = require('enigma.js')
const schema = require('enigma.js/schemas/12.170.2.json')
const SenseUtilities = require('enigma.js/sense-utilities')

//import enigma from "../components/enigma/enigma";
//import schema from "../components/enigma/schemas/12.170.2.json";
//import SenseUtilities from "../components/enigma/sense-utilities";

const MAX_RETRIES = 3;

function useEngine(config) {
  const intercept = [
    {
      // We only want to handle failed responses from QIX Engine:
      onRejected: function retryAbortedError(sessionReference, request, error) {
        console.warn("Captured Request: Rejected", error);
        // We only want to handle aborted QIX errors:
        if (
          error.code === schema.enums.LocalizedErrorCode.LOCERR_GENERIC_ABORTED
        ) {
          // We keep track of how many consecutive times we have tried to do this call:
          request.tries = (request.tries || 0) + 1;
          console.warn(`Captured Request: Retry #${request.tries}`);
          // We do not want to get stuck in an infinite loop here if something has gone
          // awry, so we only retry until we have reached MAX_RETRIES:
          if (request.tries <= MAX_RETRIES) {
            return request.retry();
          }
        }
        // If it was not an aborted QIX call, or if we reached MAX_RETRIES, we let the error
        // trickle down to potential other interceptors, and finally down to resolving/rejecting
        // the initial promise that the user got when invoking the QIX method:
        console.warn(error);

        return this.Promise.reject(error);
      },
    },
  ];

  const [engineError, setEngineError] = useState(false);
  const [errorCode, seErrorCode] = useState(null);
  const [engine, setEngine] = useState(() => {
    (async () => {
      if (config && config.qcs) {
        const tenantUri = config.host;
        const webIntegrationId = config.webIntId;

        const fetchResult = await fetch(
          `https://${tenantUri}/api/v1/csrf-token`,
          {
            mode: "cors", // cors must be enabled
            credentials: "include", // credentials must be included
            headers: {
              "qlik-web-integration-id": webIntegrationId,
              "content-type": "application/json",
            },
          }
        ).catch((error) => {
          console.log("caught failed fetch", error);
        });

        const csrfToken = fetchResult.headers.get("qlik-csrf-token");
        if (csrfToken == null) {
          console.log("Not logged in");
          seErrorCode(-1);
          return -1;
        }
        const session = enigma.create({
          schema,
          url: `wss://${tenantUri}/app/${config.appId}?qlik-web-integration-id=${webIntegrationId}&qlik-csrf-token=${csrfToken}`,
          createSocket: (url) => new WebSocket(url),
          suspendOnClose: false,
        });
       
        session.on('closed', () => {
          console.log('Session was closed, clean up!');
        })

        const _global = await session.open();
        const _doc = await _global.openDoc(config.appId);
        setEngine(_doc);
        seErrorCode(1);
        return 1;
      }
      if (config) {
        const myConfig = config;
        // Make it work for Qlik Core scaling https://github.com/qlik-oss/core-scaling
        // qlikcore/engine:12.248.0
        /* if (myConfig.core) {
          myConfig.subpath = myConfig.prefix ? `${myConfig.prefix}/app` : 'app'
          myConfig.route = `doc/${myConfig.appId}`
        } */
        const url = SenseUtilities.buildUrl(myConfig);
        try {
          const session = enigma.create({ schema, url, intercept })

          session.on('closed', () => {
            console.log('Session was closed, clean up!');
          })

          session.on('suspended', () => {
            console.warn('Captured session suspended')
          })

          session.on('error', () => {
            console.warn('Captured session error')
          })
          const _global = await session.open()
          const _doc = await _global.openDoc(config.appId)
          setEngine(_doc)
          seErrorCode(1)
          return 1
        } catch (err) {
          console.warn("Captured Error", err);
          if (err.code === 1003) {
            setEngineError("No engine. App Not found.");
            //  cogoToast.error('App Not Found')
          } else {
            //   cogoToast.error('Enigma Error')
          }
          seErrorCode(-2);
          return -2;
        }
      }
    })();
  }, []);

  return { engine, engineError, errorCode };
}

export default useEngine;
