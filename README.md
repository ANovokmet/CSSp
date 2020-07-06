# CSSp
:spaghetti: CSS Programming Language.

# Spec

#### Variables
```css
body {
  --var1: 50;
  --var2: 20;
}
```

#### Functions
```css
function .add[a][b] {
  height: calc((var(--a) + var(--b)) * 1px);
  background: white;
}

.add {
  --a: 10;
  --b: 20;
}
```

#### Conditionals
```css
.falsy {
  --return: 0;  
}

if:not(.falsy) {
  
}
```

#### Loops
```css
.log {
  --x: 10;
  background-repeat: repeat-x;
  --i: var(--x);
}
```
