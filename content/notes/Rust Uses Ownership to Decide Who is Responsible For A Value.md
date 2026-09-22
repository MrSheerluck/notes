---
title: "Rust Uses Ownership to Decide Who is Responsible For A Value"
type: note
description:
tags: []
publish: true
---

In Rust, every value has a owner. There can be only one owner at a time and the value is dropped when that owner goes out of scope [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-rules) [[The Rust Official Book|source]]
Lets see this example to understand:
```rust
fn main() {
	let message = String::from("Server started");
}
```
So, in this example, the variable `message` owns the `String`. When execution reaches the closing brace, `message` goes out of scope and Rust knows that the string is no longer needed, so it cleans the memory owned by that string

Unlike other languages we do not need to call `free`, `delete` or some other special cleanup method, Rust will perform the cleanup automatically because it knows exactly which variable owns the value.

You can think of Rust's ownership concept as responsibility. If a variable owns a value, it is responsible for keeping that value alive. Once the owner disappears or goes out of scope, Rust can clean up the value.

This is also why Rust doesn't allow two ordinary variables to independently own the same heap allocation because if both variables believed they owned it, then both might try to clean it up and that would create a double-free error
