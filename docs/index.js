const cm = CodeMirror(document.getElementById('code'), {
    value: `.sum {
    height: calc(10 + 20);
}
    
#sum {
    height: 10;
}`,
    mode: 'css',
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    theme: 'blackboard'
});

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
    console.log(value);

    try {
        let js = '';

        console.log(js);
        try {
            js = CSSp.parse(value);
            cm_js.setValue(js);
        } catch(e) {
            cm_js.setValue(e.stack);
        }

        const result = eval(js);
        console.log(result);
        resultElement.textContent = JSON.stringify(result, null, '\t');
    } catch (e) {
        resultElement.textContent = e.toString();
    }
}
cm.on('change', onChange);
onChange(cm);