---
title: "A String Slice Borrows Part of Existing String Data"
type: note
description:
tags: []
publish: true
---

A string slice lets us work with some or all of a string without creating another owned `String`. The type of a string slice is `&str` [in](https://doc.rust-lang.org/book/ch04-03-slices.html#string-slices) [[The Rust Official Book|source]]
```rust
let message = String::from("Server started");
let first_word = &message[0..6];
```
Here, the `first_word` doesn't own another copy of "Server", it refers to the first six bytes inside message



We can borrow the entire string as a slice too:
```rust
let message = String::from("Server started");

let whole: &str = &message[..];
let part: &str = &message[0..6];
```

A string literal is also a `&str`:
```rust
let message: &str = "Server started";
```
