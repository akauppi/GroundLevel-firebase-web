/*
* src/pages/Project/projectSub.js
*
* Follow a certain project. This feeds changes from Firestore to the UI.
*/
import {reactive, ref} from "vue";
//import {/*convertDateFields,*/ unshot} from '/src/firebase/utils.js';

const db = firebase.firestore();

/* REMOVE
* Provide a Promise of the reactive, ensuring only valid values are used.
*
function refReady(ref) {   // (Ref) => Promise of Ref
  let stop;
  const prom = new Promise( (resolve,reject) => {
    stop = watchEffect(() => {
      console.debug("ref has value:", ref);
      resolve(ref)    // it has a value
    })
  })

  return prom.then( () => stop() );
}
*/

/*
* Watch a certain project.
*/
function projectSub(id) {   // (id: string) => [ Ref( null | { ..projectsC-doc } ), unsub: () => () ]
  const projectD = db.doc(`projects/${id}`);

  // Using 'ref' since our fields are dynamic
  // tbd. We don't need deep reactivity - just the top level
  //
  const project = ref();

  function handleSnapshot(ss) {
    const d = ss.exists ? ss.data() : null;    // {...projectsC-doc } if exists and not '.removed' | null
    if (d) {
      console.debug("Setting 'project' to:", d);
      project.value = {...d};   // Q: how efficient is this for non-changing fields? #vueJs

      /*** If we were to use reactive
      // Vue.js 3 advice: this is way too cumbersome. We want 'project' to reflect the fields in 'tmp'. The fields are
      // dynamic, as far as we care. Is 'reactive' unsuitable and better to use 'ref'?  If so, does 'ref' efficiently
      // skip copying values that did not change (which is most of them)? #help

      const removeKeys = Object.keys(project).filter( k => Object.keys(tmp).hasOwnProperty(k) )
      if (removeKeys.length > 0) {
        console.debug("Project updated - removing keys:", removeKeys);
      }
      removeKeys.forEach( k => {
        delete project[k];
      })

      Object.entries(tmp).forEach(([k,v]) => {
        project[k] = v;
      })
      ***/

    } else {
      console.warning("Project was removed while we're working on it.");
      //project.clear();

      project.value = null;
    }
  }

  let unsub;  // () => ()
  try {
    unsub = projectD.onSnapshot(handleSnapshot,
      err =>
        console.error("Error is subscription to project:", err)
    );

  } catch (err) {
    console.error("!!!", err);
    debugger;
  }

  // 'project' is initially 'undefined', until we get the first snapshot
  return [project, unsub];
}

export {
  projectSub
}
