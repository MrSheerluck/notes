---
title: Zero Values in Go
type: note
description:
tags:
  - go
publish: true
---
You can declare a variable without giving it a starting value. Go does not leave it with an unknown value; it initializes the variable to the zero value for its type. This lets you use the variable immediately. [in](https://go.dev/ref/spec#The_zero_value) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	var count int
	var fraction float64
	var ready bool
	var name string

	fmt.Printf("%d %.1f %t %q\n", count, fraction, ready, name)
}
```
If you'll run this with `go run main.go`, you'll get `0 0.0 false ""
`
In the example, the `int` and `float64` variables start at zero, `ready` starts at `false`, and `name` starts as an empty string. `%q` puts quotes around the string in the output, making that empty value visible as `""`.

The same rule applies inside arrays. If you declare an array of bytes without an initializer, every element begins at `0`; you do not have to fill it with zeros yourself.

