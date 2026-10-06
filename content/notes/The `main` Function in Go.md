---
title: Go Starts Program Execution In The Main Function
type: note
description:
tags:
  - go
publish: true
---
When you run a Go program, it starts by initialising its packages and calling `main` in `package main` [in](https://go.dev/ref/spec#Program_execution) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	fmt.Println("Learning Go")
}
```

If you'll compile and run this, then you'll get the output `Learning Go`

In the next section, I'll explain how to compile and run a Go program but now lets understand what this program is doing

`package main` identifies the executable package. Then `func main()` declares its entry function with no arguments and no return value. The braces contain the function body and our only statement prints a line and after that our `main` function returns and the program exits. 

The `fmt` import statement helps us to get `Println`. We will learn more about importing packages later. For now, lets focus on the basics of Go
