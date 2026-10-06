---
title: Shadowing a Variable in Go
type: note
description:
tags:
  - go
publish: true
---
Just like most other languages, braces create a block. If you declare a variable inside that block with the same name as one outside it, the inner name refers to the new variable until the block ends, this is what we cal as shadowing in Go [in](https://go.dev/ref/spec#Declarations_and_scope) [[The Golang Official Documentation]]

```go
package main

import "fmt"

func main() {
	count := 10

	{
		count := 20
		fmt.Println("inside:", count)
	}

	fmt.Println("outside:", count)
}
```
If you'll run this with `go run main.go`, you'll get:
```text
inside: 20
outside: 10
```
Let's run through the program to understand what's happening. The outer `count` starts at 10 and inside the braces we have `count := 10`, this declares a different variable with the same name, this is where shadowing happens and when we print, it prints the value `20`. Then once we get out of the inner braces, then it prints the value `10` and exit

You can try changing the values, add some more nested braces and see whats happening to learn it easily