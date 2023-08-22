// loop > console #log:in-range(#is-not-0 result) {
//     --a: 10;
// }
(function($1) {
    (function($2) {
        while(isNot($2).result) {
            console.log($2);
        }
    })(loop = $1)
})({ a: 10 });

// loop > console #log { a: 15 }
(function($1) {
    (function($2){
        console.log($2);
    })(loop = $1);
})({ a: 15 });

// loop > console > #log { --res: 'hello world'; }
(function($1) {
	(function($2){
        (function($3){
            log($3);
        })(console = $2);
	})(loop = $1);
})({ res: 'hello world' });

// #a #b > console > #log { --res: 'hello world'; }
(function($1) {
	(function($2){
        (function($3){
            log($3);
        })(console = $2);
	})(a($1).b($1));
})({ res: 'hello world' });

// loop > console { a: 15 }
(function($1) {
    (function($2) {
	    console = $2;
    })(loop = $1);
})({ a: 15 });
node = {
    type: 'pipe',
    param: { type: 'objectExpression', raw: '{ a: 15 }' },
    target: { 
        type: 'pipe',
        param: { type: 'assignExpression', raw: 'loop = $1' },
        target: { type: 'assignExpression', raw: 'console = $2' }
    }
}

// b:in-range(#test result) > c {
//     --a: 10;
// }
(function($1) {
    while(test($1).result) { // target: while->pipe, test: expression
        (function($2){
            c = $2; // target: assignEx
        })(b = $1); // param: assignEx
    }
})({ a: 10 }); // param: objectEx
node = {
    type: 'pipe',
    param: { type: 'objectExpression', raw: '{ a: 15 }' },
    target: {
        type: 'while',
        body: { 
            type: 'pipe',
            param: { type: 'assignExpression', raw: 'b = $1' },
            target: { type: 'assignExpression', raw: 'c = $2' }
        },
        test: { type: 'expression', raw: 'test($1).result' }
    }
}


// console #log { a: 15 }
(function($1) {
    console.log($1);
})({ a: 15 });
node = {
    type: 'pipe',
    param: { type: 'objectExpression', raw: '{ a: 15 }' },
    target: { type: 'assignExpression', raw: 'console.log($1)' }
}

// pipestatement
(function(arg) {
    target;
})(param);