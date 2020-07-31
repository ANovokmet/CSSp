<p align="center">
  <img src="docs\readme-title.png" alt="CSSp"/>
  </br>
  CSS Programming Language.
</p>

# Syntax

#### Variables
```css
data {
    height: 10;
    --a: 50;
    --b: 20;
}
/* 
data = {
    height: 10,
    a: 50,
    b: 20
};
*/
```

#### Functions
```css
.add {
    --result: calc(var(--a) + var(--b));
}
/* 
function add(x) {
    x.result = a + 5;
    return x; 
} 
*/

#add {
  --a: 10;
  --b: 20;
}
/* add({ a:10, b:20 }); */

/* output: { result: 30 } */
```

#### Combinators
```css
console #log {
    --logged: 'Logged to console';
}
/* console.log({ logged: 'Logged to console' }) */

#add > c {
    --a: 10;
    --b: 20;
}
/* c = add({ a:10, b:20 }); */

a > b {
    --c: 40;
}
/* b = a = { c: 40 } */
```

#### Conditionals
```css
.is-not-5 {
    --result: calc(var(--a) - 5);
}
/* 
function isNot5(x) { 
    x.result = a - 5;
    return x; 
} 
*/

data > console #log:not(#is-not-5 result) {
    --a: 5;
    --logged: 'A is 5';
}
/*
    data = { a: 5, logged: 'A is 5' };
    if(!isNot5(data).result) {
        console.log(data);
    }
*/
```

#### Loops
```css
.is-not-0 {
    --a: calc(var(--a) - 1);
    --result: calc(var(--a));
}
/*
    function isNot0 (x) {
        x.a = x.a - 1;
        x.result = x.a;
        return x;
    }
*/

loop > console #log:in-range(#while-not-0 result) {
    --a: 10;
}
/*
    loop = { a: 10 };
    while(isNot0(loop).result) {
        console.log(loop);
    }
*/
```
