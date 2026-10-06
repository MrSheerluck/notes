---
title: Unused Local Variables in Go
type: note
description:
tags:
  - go
publish: true
---
If you declare a local variable and never use it, the standard Go compiler reports an error. This is easy to notice while experimenting: adding a declaration and then forgetting to read it will stop the program from compiling. [in](https://go.dev/ref/spec#Variable_declarations) [source](../sources/the-official-go-documentation.md)

```go
package main

func main() {
	count := 10 // Intentional error.
}
```
The compiler will complain that you have declared a variable but not using it