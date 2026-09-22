---
title: "Assigning A String Moves Its Ownership"
type: note
description:
tags: []
publish: true
---

Assignment doesn't always create an independent copy in Rust. For a heap-backed type such as `String`, an assignment normally transfers ownership to the new variable [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-move) [[The Rust Official Book|source]]

```rust
fn main() {
    let first = String::from("Server started");
    let second = first;

    println!("{second}");
}
```
After this assignment, `second` owns the string. Rust copies the pointer, length and capacity into `second` but it doesn't copy all the characters into a new heap allocation and then Rust considers `first` invalid. So, if you'll run this code, then the compiler will complain:

```rust
fn main() {
    let first = String::from("Server started");
    let second = first;

    println!("{first}");
    println!("{second}");
}
```

![[rust-move]]

A move is usually much cheaper than copying all the underlying data. If the string contained ten megabytes of log data, the move would transfer responsibility for the existing allocation, it would not copy those ten megabytes into another allocation, we call this *Rust Move Semantics*
