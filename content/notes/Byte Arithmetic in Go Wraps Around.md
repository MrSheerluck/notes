---
title: Byte Arithmetic in Go Wraps Around
type: note
description:
tags:
  - go
publish: true
---
A `byte` can hold `0` through `255`. When arithmetic on a byte goes past either end of that range, the result wraps around. You can think of the next value after `255` as returning to `0`. [in](https://go.dev/ref/spec#Integer_overflow) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	const limit = 255
	var value byte = limit
	value++
	fmt.Println(value)
	value--
	fmt.Println(value)
}
```

Expected output:

```text
0
255
```

`value` starts at `255`. `value++` adds one, giving `0`; then `value--` subtracts one from `0`, giving `255`. The two printed lines show both directions of the wrap. This is arithmetic on an existing byte variable, not an out-of-range constant in a declaration.