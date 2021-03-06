/*
* src/app.js
*
* Application entry point.
*
* When we get here (ie. when this module is imported):
*   - ops handling (error gathering, central logging) is initialized
*   - Firebase is initialized (using emulation in local mode)
*/
import { createApp } from 'vue'

import { getAuth } from '@firebase/auth'
const auth = getAuth();

import { init as initAside } from 'aside-keys'

import { appTitle } from './config.js'
import { router } from './router.js'

import { central } from '@ops/central'

import { appInitTrack } from './track'

import App from '/@App/index.vue'

import './common.css'
//import { assert } from '/@tools/assert'

document.title = appTitle;

const LOCAL = import.meta.env.MODE === 'dev_local';

// Build values:
//
// - 'VERSION' gives the version
//
const VERSION = _VERSION;    // both dev and production

const initializedProm = (async () => {    // Promise of ()
  const tr = appInitTrack.start();

  // Set an error handler.
  //
  // Note: For some reason, doing this in 'app-deploy-ops' wrapper didn't catch errors within the application.
  //    Never mind - we can get them here and pass on.
  //
  window.onerror = function (msg, source, lineNbr, colNbr, error) {
    console.debug("onerror saw:", {msg, source, lineNbr, colNbr, error});    // DEBUG

    //caught

    throw new Error("tbd.!!! Something should be here!!");
  }

  // Load the web component for 'aside-keys' tag.
  //
  // tbd. We'll likely need to change the way 'initAside' works so that *it* can initialize Firebase auth with
  //    the requested persistence (or can we change the persistence once initialized?). #rework

  /*await*/ initAside(auth).then( _ => {    // tbd. do we need 'await' or can we do it in parallel?
    tr.lap('aside-keys initialization');    // 499..530ms
  }).catch(err => {
    console.error("'Aside-keys' did not initialize:", err);   // never seen
    throw err;
  });

  // Initialize Vue App
  //
  const app = createApp(App);

  tr.lap('Vue initialization');

  app.use(router);    // needed for any use of the 'router'

  // Let's be curious and see whether there are ever errors from here:
  /*await*/ router.isReady().then( _ => {
    tr.lap('Router initialization');
  }).catch( err => {
    console.error("Router did not initialize:", err);   // never seen
    throw err;
  });

  // Enable Vue.js 3 Developer Tools (if the user has them installed on the browser).
  //
  // NOTE: This is *not documented* at the time of writing (Apr-21). Based on:
  //    - https://github.com/vuejs/vue-devtools/issues/1308
  //
  window.postMessage({
    devtoolsEnabled: true,
    vueDetected: true
  }, '*')

  app.mount('#app');

  // Sample of adding a meta data to the measurement (not sure if we need that)
  //tr.setAttribute('appId', app.id);

  tr.end();

  central.info("App is mounted.");
})();

export {
  initializedProm,
  LOCAL,
  VERSION
}

// DID NOT WORK with @exp API ("missing or ... permissions").
//
// tbd. Study if there's a server-side trigger for a user authenticated; move the code there.
//
//import '/@background/updateUserInfo';
