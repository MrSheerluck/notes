---
title: Build an In-Memory Token-Bucket Rate Limiter in Rust - Structs and Methods
type: article
description: Learn Rust structs and methods by building an in-memory token-bucket rate limiter that tracks tokens, refills over time, and makes testable request decisions
tags:
  - rust
publish: true
order: 4
published:
previous: "[[Understanding Rust Ownership by Building a Zero-Copy Log Line Parser]]"
next:
---
In our previous article, we learned about ownership and borrowing by building a log-line parser. This time, the main subject is structs: how to group related data, create values of a new type, and define methods that work on those values

The project that we will be building is a Rust library with a TokenBucket struct that represents one bucket in memory. You choose its capacity and an interval that restores one whole token.

But as usual, we will learn the concepts first and then focus on building the project
![[Rust Rate Limiter Tutorial.png]]


![[A Rust Struct Groups Named Fields into One Type]]

![[Field Init Shorthand Uses a Matching Variable Name]]

![[Rust Struct Update Syntax Reuses Fields from Another Instance]]

![[Rust Tuple Structs Give Positional Data a Distinct Type]]

![[Deriving Debug in Rust Lets Us Inspect a Struct]]

![[An impl Block Gives a Rust Struct Methods]]

![[A Method Receiver in Rust Says How It Uses the Instance]]

![[An Associated Function in Rust Does Not Need an Instance]]

![[Rust Project - Build a Token-Bucket Rate Limiter Library]]