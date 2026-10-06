---
title: Integer Types in Go
type: note
description:
tags:
  - go
publish: true
---
Go offers several integer types because different values need different ranges. A signed type can hold negative and positive numbers. An unsigned type starts at zero, and the number of bits determines how high it can go. [in](https://go.dev/ref/spec#Numeric_types) [[The Golang Official Documentation]]

| Type | Values or purpose |
| --- | --- |
| `int8` | −128 through 127 |
| `uint8` | 0 through 255 |
| `int16`, `int32`, `int64` | Signed values with 16, 32, or 64 bits |
| `uint16`, `uint32`, `uint64` | Unsigned values with 16, 32, or 64 bits |
| `int` | Signed, either 32 or 64 bits |
| `uint` | Unsigned, with the same width as `int` |

The table lists the common widths. With `n` bits, an unsigned type can store `0` through `2ⁿ − 1`. A signed type uses part of its range for negative values, so it stores `−2ⁿ⁻¹` through `2ⁿ⁻¹ − 1`.

```go
package main

import "fmt"

func main() {
	var signed int8 = -12
	var unsigned uint8 = 12
	fmt.Printf("%v %T\n", signed, signed)
	fmt.Printf("%v %T\n", unsigned, unsigned)
}
```

If you'll run this, you'll get

```text
-12 int8
12 uint8
```

In the example, `-12` fits in `int8` but could not fit in `uint8`. The `%T` output confirms the two variables have different types. For ordinary counts and indices, `int` is usually convenient, choose a fixed-width type when the exact width is part of the data you are handling.
