const events = [
    { type: "set", key: "a", value: "x", version: 1 },
    { type: "set", key: "b", value: "y", version: 2 },
    { type: "delete", key: "a", version: 3 },
    { type: "set", key: "b", value: "DIFF", version: 1 } // older version, should be ignored
];

function processVersionedEvents(events) {
    if (!Array.isArray(events)) {
        throw new Error("Test input must be an array, got: " + typeof events);
    }

    const store = new Map();

    for (const input of events) {
        switch (input.type) {
            case 'set': {
                if (!store.has(input.key) || store.get(input.key).version < input.version) {
                    store.set(input.key, { value: input.value, version: input.version });
                }
                break;
            }
            case 'delete': {
                if (store.has(input.key) && store.get(input.key).version < input.version) {
                    store.delete(input.key);
                }
                break;
            }
            default:
                continue; // ignore unknown types
        }
    }

    // Convert Map of { value, version } to plain object { key: value }
    const result = {};
    for (const [key, obj] of store) {
        result[key] = obj.value;
    }
    return result;
}

function processVersioningActions(events) {
    if (!Array.isArray(events)) {
        console.log("Malformed input", events);
        return {};
    }

    const store = new Map();
    events.sort((a, b) => a.version - b.version);

    for (const event of events) {
        if (!event.key || event.version === undefined) {
            console.log("Malformed event", event);
            continue;
        }

        switch (event.type) {
            case 'set':
                store.set(event.key, { value: event.value, version: event.version });
                break;
            case 'delete':
                if (store.has(event.key) && store.get(event.key).version < event.version) {
                    store.delete(event.key);
                }
                break;
            default:
                continue;
        }
    }

    const result = {};
    for (const [key, obj] of store) {
        result[key] = obj.value;
    }

    return result;
}

class VersionedStore {
  constructor() {
    this.store = new Map(); // key -> [{ version, value, type }]
  }

  applyEvent(event) {
    if (!event.key || !event.version) return; // ignore malformed

    if (!this.store.has(event.key)) {
      this.store.set(event.key, []);
    }

    this.store.get(event.key).push({
      version: event.version,
      value: event.value,
      type: event.type
    });
  }

  printStore() {
    console.log("=== Internal Store Structure ===");
    for (const [key, history] of this.store) {
      console.log(key, "=>", history);
    }
    console.log("================================");
  }

  snapshotAtVersion(version) {
    const result = {};
    for (const [key, history] of this.store) {
      for (let i = history.length - 1; i >= 0; i--) {
        const e = history[i];
        if (e.version <= version) {
          if (e.type === 'set') result[key] = e.value;
          break;
        }
      }
    }
    return result;
  }
}

class HistoryVersion {
    constructor(){
        this.store = new Map();
    }

    addVersionForValue(event){
        if(!event.value || !event.version) return;
        if(!this.store.has(event.value)){
            this.store.set(event.key, []);
        }
        this.store.get(event.key).push({
            version: event.version,
            value: event.value,
            type: event.type
        });
    }

    snapShotVersion (version){
        const result = {};
        for(const [key,snapShot] of this.store){
            for(const i = snapShot.length-1;i>=0;i--){
                const event = snapShot[i];
                if(event.version<=version){
                    if(event.type ==='set') 
                        result[key] = event.value;
                    break;
                }
            }
        }
        return result;
    }

    printStore() {
        console.log("=== Internal Store Structure ===");
        for (const [key, history] of this.store) {
        console.log(key, "=>", history);
        }
        console.log("================================");
    }

}

// Sample usage
// const store = new VersionedStore();
const store = new HistoryVersion();

store.applyEvent({ key: "a", version: 1, type: "set", value: "x" });
store.applyEvent({ key: "b", version: 2, type: "set", value: "y" });
store.applyEvent({ key: "a", version: 3, type: "delete" });
store.applyEvent({ key: "b", version: 4, type: "set", value: "z" });

store.printStore();





module.exports = { processVersionedEvents };