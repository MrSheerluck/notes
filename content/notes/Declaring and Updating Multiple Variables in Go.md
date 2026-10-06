---
title: Reusing Shorthand in the Same Block in Go
type: note
description:
tags:
  - go
publish: true
---
Sometimes one statement needs to create a new variable and update an existing one. Go allows `:=` to do both in the same block but at least one name on the left must be new and the existing variable must keep its type [in](https://go.dev/ref/spec#Short_variable_declarations) [[The Golang Official Documentation]]

```go
package main

func main() {
	count := 10
	count, limit := 20, 30
	fmt.Println(count, limit)
}
```
If you'll run this with `go run main.go`, you'll get `20 30`

In `count, limit := 20, 30`, `count` already exists and `limit does not`. Go assigns `20` to the existing count and declares `limit` with the value 30`

Now if you'll remove limit and try to declare only count again, you'll get a compiler error