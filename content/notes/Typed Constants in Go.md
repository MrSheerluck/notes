---
title: Typed Constants in Go
type: note
description:
tags:
  - go
publish: true
---
You can put a type in a constant declaration, such as `const initial byte = 65`. Now `initial` has type `byte`; Go does not treat it like an untyped number in later assignments. [in](https://go.dev/ref/spec#Constants) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	const initial byte = 65
	var value byte = initial
	fmt.Printf("%v %T\n", value, value)
}
```

If you'll run it with `go run main.go`, you'll get `65 uint8`

The first declaration works because a `byte` constant is being used to initialize a `byte` variable. The value happens to be `65`, but the important part is that the types match.

Try the same constant in an `int64` declaration:

```go
package main

import "fmt"

func main() {
	const initial byte = 65
	var count int64 = initial // Intentional error.
	fmt.Println(count)
}
```
This won't work and you'll get a compilation error. The compiler rejects the direct assignment because `initial` is a typed `byte` constant. If you want an `int64`, write `int64(initial)` to convert it. The fact that `65` would fit in `int64` does not erase the constant’s declared type.

