---
title: Declaring a Constant in Go
type: note
description:
tags:
  - go
publish: true
---
A constant is a name for a value that will not change while the program runs. You can declare it with `const`. Unlike a variable, you cannot give that name a new value later. [in](https://go.dev/ref/spec#Constant_declarations) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	const maxItems = 30_000
	fmt.Println(maxItems)
}
```
If you'll run this, you'll get `30000`

`const maxItems = 30_000` gives the fixed value a readable name. The underscore in the number is only for readability, so printing it shows `30000`.

Try assigning a new value to the constant:

```go
package main

import "fmt"

func main() {
	const maxItems = 30_000
	maxItems = 100 // Intentional error.
	fmt.Println(maxItems)
}
```
You'll get a compilation error