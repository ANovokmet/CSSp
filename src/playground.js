import CSSp from './index';

const examples = {
    call: `.sum {\n\theight: calc(10 + 20);\n}\n\n#sum > console #log {\n\theight: 10;\n}`,
    if: `.is-not-5 {\n\t--result: calc(var(--a) - 5);\n}\nconsole #log:not(#is-not-5 result) {\n\t--a: 5;\n\t--logged: 'A is 5';\n}`,
    loop: `.is-not-0 {\n\t--a: calc(var(--a) - 1);\n\t--result: calc(var(--a));\n}\n\nconsole #log:matches(#is-not-0 result) {\n\t--a: 10;\n}`,
    fibonacci: `.fib {\n\t--prevPrev: calc(var(--prev));\n\t--prev: calc(var(--curr));\n\t--curr: calc(var(--prevPrev) + var(--prev));\n}\n\n.fib-init {\n\t--prev: 0;\n\t--curr: 1;\n}\n\n.loop {\n\t--n: calc(var(--n) - 1);\n}\n\n#fib-init > #fib:matches(#loop n) > console #log {\n\t--n: 10;\n}`
}

const cm = CodeMirror(document.getElementById('code'), {
    value: loadValue(),
    mode: 'css',
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
});
console.log(document.getElementById('code'), cm);

function loadValue() {
    if(window.location.hash) {
        const key = window.location.hash.substr(1);
        if(examples[key])
            return examples[key];
    }
    if(localStorage.getItem('last_value'))
        return localStorage.getItem('last_value');

    return examples['call'];
}

const resultElement = document.getElementById('result');

const cm_js = CodeMirror(document.getElementById('js-code'), {
    value: ``,
    mode: 'javascript',
    lineNumbers: true,
    styleActiveLine: true,
    readOnly: true
});

function onChange(cm) {
    const value = cm.getValue();
    localStorage.setItem('last_value', value);

    try {
        let js = '';

        console.log(js);
        try {
            //js = CSSp.parse(value);
            window.ast = CSSp.transform(value);
            js = CSSp.transpile(window.ast);
            cm_js.setValue(js);
        } catch(e) {
            console.error(e);
            cm_js.setValue(e.stack);
        }

        const result = eval(js);
        console.log('result:', result);
        resultElement.textContent = JSON.stringify(result, null, '\t');
    } catch (e) {
        console.error(e);
        resultElement.textContent = e.toString();
    }
}
cm.on('change', onChange);
onChange(cm);