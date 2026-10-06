---
title: Go Run Can Compile And Execute A Source File
type: note
description:
tags:
  - go
publish: true
---
Once you have a Go program in a file, you can run it with `go run`. To run a file named `main.go`, you can run the command `go run main.go` in your terminal. This will let Go compile that file and then execute it [in](https://pkg.go.dev/cmd/go#hdr-Compile_and_run_Go_program) [[The Golang Official Documentation]]

Let's create a directory so we will have a place to save and run our examples:
```bash
mkdir go-experiments
```
Open this folder in your preferred IDE and then create a file called `main.go`

In that `main.go`, put this whole program:
```go
package main

import "fmt"

func main() {
	fmt.Println("Learning Go")
}
```

Now, lets run the it using the command `go run main.go` from that directory and you should see the output like this `Learning Go`

When a directory has a go.mod file, `go run .` is another useful form. The dot means "use the package in this directory", so it can include more than one Go file in the package.

