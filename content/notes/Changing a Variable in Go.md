---
title: Changing a Variable in Go
type: note
description:
tags:
  - go
publish: true
---
Now that we know how to declare a variable in many ways, lets understand how to assignment works. In Go, use `=` for an assignment to an existing variable. The new value must be compatible with the variable's type [in](https://go.dev/ref/spec#Assignment_statements) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	count := 10
	count = 20
	fmt.Println(count)
}
```

If you'll run this, you'll get `20`
The first line `count := 10` creates `count` then the next next `count = 20` puts `20` in that same variable, so printing it gives `20` and then finally we are printing it