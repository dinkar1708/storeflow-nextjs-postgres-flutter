# Test Results

This directory contains automatically generated test results from Vitest.

## Files Generated After Running Tests

- `test-results.json` - JSON format test results
- `index.html` - HTML test report (open in browser)
- `coverage/` - Code coverage reports (if enabled)

## How to View Results

After running tests with `npm test`, open the HTML report:

```bash
open docs/test-result/index.html
```

Or view the JSON results:

```bash
cat docs/test-result/test-results.json | jq
```

## Generated Files

All files in this directory are auto-generated and ignored by git.
