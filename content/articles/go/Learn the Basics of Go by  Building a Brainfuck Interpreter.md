---
title: "Learn the Basics of Go by  Building a Brainfuck Interpreter"
type: article
description:
tags: []
publish: false
order:
published:
previous:
next:
---
Hello there. In this first Go article, we will understand variables, types, functions, and control flow, then use those concepts to build a Brainfuck interpreter.

Brainfuck has eight commands. That makes it a useful first project: we can focus on Go while still writing a program that reads and executes another program. We will get to the project after the concepts.


![[Learn Go_ Brainfuck Interpreter.png]]

Before starting, check your installation:

```sh
go version
```

If Go is missing, follow the official installation instructions [in](https://go.dev/doc/install) [source](../sources/the-official-go-documentation.md). The shell commands here assume Bash or Zsh on macOS or Linux.

Each conceptual section below explains one claim. Its **in** link identifies the relevant documentation section, and **source** identifies the shared source note. Every Go example in these sections is a complete program, so you can study a note on its own and run its example without copying code from an earlier note. Some examples are deliberately invalid so we can examine the compiler feedback.

No previous Go knowledge is required. You should be comfortable creating files and running terminal commands. This first project spans several sessions; stop between notes or at a working stage of the project whenever you need to.