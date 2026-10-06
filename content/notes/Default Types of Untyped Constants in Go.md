---
title: Default Types of Untyped Constants in Go
type: note
description:
tags:
  - go
publish: true
---
An untyped constant can take a type from its destination. But with a declaration such as `count := 10`, there is no destination type written down. In that situation Go uses the constant’s default type. [in](https://go.dev/ref/spec#Constants) [source](../sources/the-official-go-documentation.md)

```go
package main

import "fmt"

func main() {
	count := 10
	ratio := 1.5
	letter := 'A'
	ready := true
	name := "Go"
	number := 1 + 2i
	fmt.Printf("%T %T %T %T %T %T\n", count, ratio, letter, ready, name, number)
}
```

if you'll run this, you'll get `int float64 int32 bool string complex128`

The output shows those defaults in order. An integer literal becomes `int`, a floating-point literal becomes `float64`, a rune literal becomes `rune` (`int32`), a boolean becomes `bool`, a string becomes `string`, and a complex literal becomes `complex128`.

`%T` prints the resulting variable type, which is why the output says `int32` for `letter`: `rune` is an alias for `int32`. Once each variable is declared, its type is fixed like any other variable’s type.
