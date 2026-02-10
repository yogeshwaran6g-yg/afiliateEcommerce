
import { validator } from "./helper.js";

const testCases = [
    {
        name: "Required Field - Success",
        data: "Hello",
        rules: { required: true },
        expected: true
    },
    {
        name: "Required Field - Failure (Empty String)",
        data: "",
        rules: { required: true },
        expected: false
    },
    {
        name: "Required Field - Failure (Null)",
        data: null,
        rules: { required: true },
        expected: false
    },
    {
        name: "Type Check - String Success",
        data: "Test",
        rules: { type: "string" },
        expected: true
    },
    {
        name: "Type Check - Number Success",
        data: 123,
        rules: { type: "number" },
        expected: true
    },
    {
        name: "Type Check - Array Success",
        data: [1, 2, 3],
        rules: { type: "array" },
        expected: true
    },
    {
        name: "Type Check - JSON Success (Object)",
        data: { a: 1 },
        rules: { type: "json" },
        expected: true
    },
    {
        name: "Type Check - JSON Success (String)",
        data: '{"a": 1}',
        rules: { type: "json" },
        expected: true
    },
    {
        name: "Email Check - Success",
        data: "test@example.com",
        rules: { email: true },
        expected: true
    },
    {
        name: "Email Check - Failure",
        data: "not-an-email",
        rules: { email: true },
        expected: false
    },
    {
        name: "Schema Check - Success",
        data: { email: "user@test.com", age: 25, tags: ["js", "node"] },
        rules: {
            schema: {
                email: { required: true, email: true },
                age: { type: "number", min: 18 },
                tags: { type: "array", min: 1 }
            }
        },
        expected: true
    },
    {
        name: "Schema Check - Failure",
        data: { email: "invalid-email", age: 15 },
        rules: {
            schema: {
                email: { email: true },
                age: { min: 18 }
            }
        },
        expected: false
    },
    {
        name: "Min/Max Length Check",
        data: "ABC",
        rules: { min: 2, max: 4 },
        expected: true
    },
    {
        name: "Min/Max Value Check",
        data: 10,
        rules: { min: 5, max: 15 },
        expected: true
    }
];

console.log("Running Validator Tests...\n");
let passed = 0;

testCases.forEach((tc, index) => {
    const result = validator(tc.data, tc.rules);
    if (result.isValid === tc.expected) {
        console.log(`[PASS] Case ${index + 1}: ${tc.name}`);
        passed++;
    } else {
        console.log(`[FAIL] Case ${index + 1}: ${tc.name}`);
        console.log("  Expected:", tc.expected);
        console.log("  Actual:", result.isValid);
        console.log("  Errors:", result.errors);
    }
});

console.log(`\nTests Completed: ${passed}/${testCases.length} passed.`);
if (passed === testCases.length) {
    process.exit(0);
} else {
    process.exit(1);
}
