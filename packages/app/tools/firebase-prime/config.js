/*
* config.js
*
* Provide configuration info, based on 'firebase.json' (in the current folder).
*/
import {readFileSync} from "fs";

const firebaseJson = "./firebase.json";

// Get the Firebase emulator ports from Firebase configuration file.
//
const [firestorePort, authPort] = (_ => {
  const raw = readFileSync(firebaseJson);
  const conf = JSON.parse(raw);

  const a = conf?.emulators?.firestore?.port || fail(`No 'emulators.firestore.port' in ${firebaseJson}`);
  const b = conf?.emulators?.auth?.port || fail(`No 'emulators.auth.port' in ${firebaseJson}`);
  return [a, b];
})();

export {
  firestorePort,
  authPort
}
