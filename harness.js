const { processVersionedEvents } = require("./versioning");

function assertEqual(actual, expected, msg = "") {
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    if (!pass) {
        console.error("❌", msg, "\n expected:", expected, "\n   actual:", actual);
        process.exitCode = 1;
    } else {
        console.log("✅", msg || "pass");
    }
}

function runTests(cases, fn) {
    for (const { name, events, expected } of cases) {
        let actual;
        try {
            actual = fn(events);
        } catch (err) {
            actual = { error: err.message };
        }
        assertEqual(actual, expected, name);
    }
}

// --- Test cases ---
const testCases = [
    {
        name: "Basic set and delete",
        events: [
            { type: "set", key: "a", value: "x", version: 1 },
            { type: "set", key: "b", value: "y", version: 2 },
            { type: "delete", key: "a", version: 3 }
        ],
        expected: { b: "y" }
    },
    {
        name: "Older version ignored",
        events: [
            { type: "set", key: "a", value: "x", version: 2 },
            { type: "set", key: "a", value: "y", version: 1 }
        ],
        expected: { a: "x" }
    },
    {
        name: "Delete only applies if newer version",
        events: [
            { type: "set", key: "a", value: "x", version: 2 },
            { type: "delete", key: "a", version: 1 }
        ],
        expected: { a: "x" }
    },
    {
        name: "Delete removes key if newer",
        events: [
            { type: "set", key: "a", value: "x", version: 1 },
            { type: "delete", key: "a", version: 2 }
        ],
        expected: {}
    },
    {
        name: "Conflicting duplicate versions ignored",
        events: [
            { type: "set", key: "a", value: "x", version: 1 },
            { type: "set", key: "a", value: "DIFF", version: 1 } // same version, should not override
        ],
        expected: { a: "x" }
    },
    {
        name: "Malformed event ignored",
        events: [
            { type: "set", key: "a", version: 1 } // missing value
        ],
        expected: {}
    },
    {
        name: "Mixed scenario",
        events: [
            { type: "set", key: "a", value: "x", version: 1 },
            { type: "set", key: "b", value: "y", version: 2 },
            { type: "set", key: "a", value: "DIFF", version: 1 }, // ignored
            { type: "delete", key: "b", version: 3 }
        ],
        expected: { a: "x" }
    }
];

// --- Run all tests ---
runTests(testCases, processVersionedEvents);
