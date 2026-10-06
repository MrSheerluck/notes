---
title: byte and unit8 in Go
type: note
description:
tags:
  - go
publish: true
---
In Go, `byte` is an alias for `uint8`. Both names mean the same unsigned 8-bit integer type. The name `byte` is useful when you are dealing with raw data, where each value represents one byte. [in](https://go.dev/ref/spec#Numeric_types) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	var value byte = 65
	var same uint8 = value
	fmt.Printf("%v %T\n", value, value)
	fmt.Println(same)
}
```

If you'll run this, you'll get

```text
65 uint8
65
```

`value` is declared as a `byte` and assigned directly to a `uint8` variable named `same`. There is no conversion because these are two names for one type. `%T` prints `uint8`, which is the underlying type name Go displays for this alias.

