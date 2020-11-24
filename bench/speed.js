const {css, js, html, raw} = require('../dist/index.js');

const generateHTML = () => html`
<!doctype html>
<script>
function helloWorld() {
  console.log('Hello World 👋');
}
</script>
<style>
body {
  font-family: sans-serif;
}
</style>
<div
  test=${'lol " asd'}
  .contentEditable=${false}
  onclick=${() => 'whatever'}
  onmouseover="${'callback(event)'}"
  data=${{test: 1, otherTest: 2}}
>
  ${[
    html`<p aria=${{role: 'button', labelledby: 'id'}}>Some ${raw`"content"`}</p><hr>`,
    html`<div />`,
    raw`<shena-${'test'}-nigans />`
  ]}
</div>
`;

console.time('Cold');
const htmlCold = generateHTML();
console.timeEnd('Cold');

console.time('Hot');
const htmlHot = generateHTML();
console.timeEnd('Hot');