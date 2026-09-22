---
title: "Values Implementing Copy Remain Usable After Assignment"
type: note
description:
tags: []
publish: true
---

In Rust, integers do not behave like `String` during assignment, for example:
```rust
fn main() {
    let first = 42;
    let second = first;

    println!("{first}");
    println!("{second}");
}
```
This will compile perfectly fine because integers implement the `Copy` trait. We will understand about traits later [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#stack-only-data-copy) [[The Rust Official Book|source]]

But in simple terms, Rust duplicates the value `42`, so both variables remain usable. There is no shared heap allocation for the two variables. Copying the integer is also inexpensive because its size is small and fixed. 

Common `Copy` types include integers, floating-point values, booleans, characters, shared references, and tuples contains only other `Copy` values
