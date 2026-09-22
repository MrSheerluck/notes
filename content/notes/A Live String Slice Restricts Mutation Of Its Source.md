---
title: "A Live String Slice Restricts Mutation Of Its Source"
type: note
description:
tags: []
publish: true
---

A slice points into an existing string, so the normal borrowing rules apply to both the slice and its source [in](https://doc.rust-lang.org/book/ch04-03-slices.html#the-slice-type) [[The Rust Official Book|source]]. For example, lets take this:
```rust
fn main() {
    let mut line = String::from("INFO Server started");

    let level = &line[0..4];

    line.clear();

    println!("{level}");
}
```
This won't compile because `level` refers to bytes inside `line`. So, calling `line.clear()` could invalidate that reference, but `level` is still used afterwards

Rust rejects the mutation instead of letting us keep a broken slice
