---
title: A Var Declaration Can Specify A Variable's Type
type: note
description:
tags:
  - go
publish: true
---
A variable is a named place to keep a value. In Go, you can declare one with `var` and write its type and starting value: `var name type = value`. The variable can hold a different value later as long as it has the right type [in](https://go.dev/ref/spec#Variable_declarations) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	var count int = 10
	fmt.Println(count)
}
```
If you'll run this with `go run main.go`, you'll get the output `10`.

 `var count int = 10`  here we are declaring a variable named `count` and give it a type `int` and start it at `10`. The next like prints the value currently in `count`, so the output is `10`. Here the type is part of the declaration and its not inferred from the name