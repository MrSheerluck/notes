---
title: Go Mod Init Creates Module Metadata
type: note
description:
tags:
  - go
publish: true
---
A module is how Go groups a project's packages under one path. To start one, run `go mod init` in the project directory. It creates a `go.mod` file that records the module path and later tracks dependencies [in](https://go.dev/ref/mod#go-mod-init) [[The Golang Official Documentation]]

I'll show you how to use it while building oru first project.

You normally initialzie the module once, at the project root. You can still run a single file with `go run main.go` but when you want Go to run the package in the module directory, use `go run .`