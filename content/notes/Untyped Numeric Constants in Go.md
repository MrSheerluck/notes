---
title: Untyped Numeric Constants in Go
type: note
description:
tags:
  - go
publish: true
---
When you write a constant without an explicit type, Go can use its value in more than one numeric context. The value must fit the destination type, but you do not need a conversion just because the destinations have different numeric types. [in](https://go.dev/ref/spec#Constants) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	const initial = 65
	var small byte = initial
	var large int64 = initial
	fmt.Printf("%v %T\n", small, small)
	fmt.Printf("%v %T\n", large, large)
}
```

If you'll run it with `go run main.go`, you'll get:

```text
65 uint8
65 int64
```

`initial` is the untyped value `65`. That value fits in a `byte` and in an `int64`, so both declarations work. Printing `%T` shows that `small` is a `uint8` (the type named by `byte`) and `large` is an `int64`. The constant did not force both variables to have the same type.

