const { runTests } = require("./harness");

// Candidate implements:
function processEvents(rawEvents) {
  if (!Array.isArray(rawEvents)) {
    throw new Error("Test input must be an array of JSON strings, got: " + typeof rawEvents);
  }

  // Parse JSON
  const events = rawEvents.map(JSON.parse);

  // Sort by ts ascending
  events.sort((a, b) => a.ts - b.ts);

  const store = {};
  const seen = new Map(); // id -> canonical event
  const errors = [];

  for (const event of events) {
    // Skip malformed 'set' (missing value)
    if (event.type === "set" && !("value" in event)) continue;
if (seen.has(event.id)) {
    const prev = seen.get(event.id);

    // Check for conflict: same id, different type/key/value
    const isConflict = 
        prev.type !== event.type ||
        prev.key !== event.key ||
        prev.value !== event.value;

    if (isConflict) {
        errors.push({ id: event.id, error: "conflicting_duplicate" });
    }

    // Always skip applying this event (whether conflict or exact duplicate)
    continue;
}

// Apply event
if (event.type === "set") store[event.key] = event.value;
else if (event.type === "delete") delete store[event.key];

// Mark as seen
seen.set(event.id, event);
  }

  // Sort store keys alphabetically
  const sortedStore = Object.fromEntries(
    Object.entries(store).sort(([a], [b]) => a.localeCompare(b))
  );

  return { store: sortedStore, errors };
}

const testCases = [
  [
    "Part A: set and delete in time order",
    [
      `{"id":"1","ts":1,"type":"set","key":"a","value":"x"}`,
      `{"id":"2","ts":2,"type":"set","key":"b","value":"y"}`,
      `{"id":"3","ts":3,"type":"delete","key":"a"}`
    ],
    { store: { b: "y" }, errors: [] }
  ],
  [
    "Part B: exact duplicate id later => ignore",
    [
      `{"id":"9","ts":2,"type":"set","key":"a","value":"x"}`,
      `{"id":"9","ts":5,"type":"set","key":"a","value":"x"}`
    ],
    { store: { a: "x" }, errors: [] }
  ],
  [
    "Part B: late retry arrives with earlier ts; still no-op",
    [
      `{"id":"10","ts":5,"type":"set","key":"a","value":"x"}`,
      `{"id":"10","ts":1,"type":"set","key":"a","value":"x"}`
    ],
    { store: { a: "x" }, errors: [] }
  ],
  [
    "Part C: conflicting duplicate -> error",
    [
      `{"id":"11","ts":1,"type":"set","key":"a","value":"x"}`,
      `{"id":"11","ts":2,"type":"set","key":"a","value":"DIFF"}`
    ],
    { store: { a: "x" }, errors: [{ id: "11", error: "conflicting_duplicate" }] }
  ],
  [
    "Multiple keys + deletes",
    [
      `{"id":"12","ts":1,"type":"set","key":"a","value":"x"}`,
      `{"id":"13","ts":2,"type":"set","key":"b","value":"y"}`,
      `{"id":"14","ts":3,"type":"delete","key":"b"}`
    ],
    { store: { a: "x" }, errors: [] }
  ],
  [
    "Keys sorted in output",
    [
      `{"id":"15","ts":1,"type":"set","key":"z","value":"1"}`,
      `{"id":"16","ts":2,"type":"set","key":"m","value":"2"}`
    ],
    { store: { m: "2", z: "1" }, errors: [] }
  ],
  [
    "Ignore malformed set missing value",
    [
      `{"id":"17","ts":1,"type":"set","key":"k"}`
    ],
    { store: {}, errors: [] }
  ],
  [
    "Mixed: dedupe + conflict + deletes",
    [
      `{"id":"18","ts":2,"type":"set","key":"a","value":"x"}`,
      `{"id":"18","ts":3,"type":"set","key":"a","value":"x"}`,
      `{"id":"19","ts":4,"type":"set","key":"b","value":"y"}`,
      `{"id":"20","ts":5,"type":"delete","key":"a"}`,
      `{"id":"19","ts":6,"type":"set","key":"b","value":"DIFF"}`
    ],
    { store: { b: "y" }, errors: [{ id: "19", error: "conflicting_duplicate" }] }
  ]
];


// --- Tests ---
runTests(testCases,processEvents);

