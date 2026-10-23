import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 29,
  title: "Browser Tools Across Host and Cloud",
  description: "Some tasks need a rendered page, a form interaction, or a screenshot of an application that builds itself with JavaScript. A text-fetch tool is not a click-and-fill browser controller.",
  concepts: ["Fixed browser capabilities", "Trusted fixture origin", "Navigation is separate from request egress"],
  scope: "Validates and executes a local form-preview model. It does not launch Playwright or claim a browser network sandbox. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Preview the local form", "input": {"url": "http://127.0.0.1:3029/fixture", "quantity": 3, "redirected": false}, "expected": "passed", "checks": {"previewTotalCents": 750}}, {"id": "1", "label": "Reject navigation outside the fixture", "input": {"url": "https://external.invalid", "quantity": 3, "redirected": false}, "expected": "rejected", "checks": {}}, {"id": "2", "label": "Reject a redirect", "input": {"url": "http://127.0.0.1:3029/fixture", "quantity": 3, "redirected": true}, "expected": "rejected", "checks": {}}],
  async run(input) {

const url=new URL(text(input,"url")),qty=number(input,"quantity");
if(url.origin!=="http://127.0.0.1:3029"||url.pathname!=="/fixture"||flag(input,"redirected"))return report("rejected","Navigation or redirect is outside the fixed fixture policy",{},["Check the exact fixture origin and path","Reject redirects before following them"]);
if(!Number.isInteger(qty)||qty<1||qty>100)return report("rejected","Quantity is outside the reviewed form schema",{},["Expose fixed operations rather than arbitrary selectors"]);
return report("passed","Calculated a non-submitting local form preview",{quantity:qty,previewTotalCents:qty*250,submitted:false,allowedOperations:["navigate fixture","fill quantity","preview"]},["Validate a fixed capability","Fill the bounded field in the local model","Preview without submitting an external form"]);

  }
};
