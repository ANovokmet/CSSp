<p align="center">
  <img src="docs\readme-title.png" alt="CSSp"/>
  </br>
  CSS Programming Language.
</p>

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

if:in-range[min=0][max=20] {
  
}
```

#### Loops
```css
.log {
  --x: 10;
  background-repeat: repeat-x;
  --i: var(--x);
}

loop:in-range[min=0][max=20] {

}
```
