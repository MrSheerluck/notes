---
title: Letting Go Infer A Variable's Type
type: note
description:
tags:
  - go
publish: true
---
You do not always have to write the type in a `var` declaration. If you provide a starting value, Go can determine the variable's type from that value. The variable still has fixed type after it is declared [in](https://go.dev/ref/spec#Variable_declarations) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	var count = 10
	fmt.Printf("%v %T\n", count, count)
}
```
If you'll run this with `go run main.go`, then you'll get the output `10 int`

In `var count = 10`, the untyped integer 10 gives count the default type `int`. The program prints both the value and the type: `%v` shows `10` and `%T` shows `int`. Its convenient to not write the type but it doesn't mean that `count` can later turn into a string or another type

