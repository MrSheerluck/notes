---
title: "Rust Prevents References From Outliving Their Owners"
type: note
description:
tags: []
publish: true
---

A reference is only valid while the value it points to still exists. Rust prevents us from returning a reference to a local value that is about to be destroyed [in](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#the-rules-of-references) [[The Rust Official Book|source]]. The function will not compile:
```rust
fn create_message() -> &String {
    let message = String::from("Server started");
    &message
}
```
`message` is dropped when the function ends. Returning a reference to it would leave the caller with a reference pointing to invalid memory

![[rust-prevents-dangling-reference]]


Returning the owned value fixes the problem:
```rust
fn create_message() -> String {
    String::from("Server started")
}
```
Ownership goes back to the caller so the value stays alive
