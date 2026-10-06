---
title: Declaring a Short Hand Variable in Go
type: note
description:
tags:
  - go
publish: true
---
Inside a function, `:=` is a short way to declare a variable and give it a starting value. Go determines the type from the value on the right. You will see this form often for local variables [in](https://go.dev/ref/spec#Short_variable_declarations) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	count := 10
	fmt.Printf("%v %T\n", count, count)
}
```
If you'll run this with `go run main.go`, you'll get the output `10 int`

Here, `count := 10` creates a new variable of type `int`, just like `var count = 10` would have created. The output shows the value and the type so you can check what go chose. `:=` only works inside a function so if you declare a variable outside a function like a global variable or something then use `var`

