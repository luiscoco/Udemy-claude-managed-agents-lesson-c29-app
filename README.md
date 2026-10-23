# C29 · Browser Tools Across Host and Cloud

Validates and executes a local form-preview model. It does not launch Playwright or claim a browser network sandbox. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Fixed browser capabilities
- Trusted fixture origin
- Navigation is separate from request egress

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3029`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3029
```

## How the app was build

### 1. Restrict navigation to the fixed fixture

The example accepts one exact local origin and path and rejects redirected navigation. It models the navigation policy rather than driving a browser.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const url = new URL(text(input, "url")),
  qty = number(input, "quantity");

if (
  url.origin !== "http://127.0.0.1:3029" ||
  url.pathname !== "/fixture" ||
  flag(input, "redirected")
)
  return report(
    "rejected",
    "Navigation or redirect is outside the fixed fixture policy",
    {},
    [
      "Check the exact fixture origin and path",
      "Reject redirects before following them",
    ],
  );
```

### 2. Expose a bounded form operation

Quantity must be an integer from 1 to 100. The result calculates a preview at 250 cents per unit and retains submitted:false; no external form is submitted and no arbitrary selectors are exposed.

Source: [src/lesson.ts](src/lesson.ts#L15) · selected statements

```typescript
if (!Number.isInteger(qty) || qty < 1 || qty > 100)
  return report("rejected", "Quantity is outside the reviewed form schema", {}, [
    "Expose fixed operations rather than arbitrary selectors",
  ]);

return report(
  "passed",
  "Calculated a non-submitting local form preview",
  {
    quantity: qty,
    previewTotalCents: qty * 250,
    submitted: false,
    allowedOperations: ["navigate fixture", "fill quantity", "preview"],
  },
  [
    "Validate a fixed capability",
    "Fill the bounded field in the local model",
    "Preview without submitting an external form",
  ],
);
```

### Check your understanding

Run **Preview the local form** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "url": "http://127.0.0.1:3029/fixture",
    "quantity": 3,
    "redirected": false
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "previewTotalCents": 750
  }
}
```

Then try **Reject navigation outside the fixture**. Its expected outcome is `rejected`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
