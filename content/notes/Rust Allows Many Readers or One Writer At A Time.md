---
title: "Rust Allows Many Readers or One Writer At A Time"
type: note
description:
tags: []
publish: true
---

This is actually important to understand. Rust does not allow arbitrary combinations of references. At a particular time, we can have any number of immutable references or one mutable reference [in](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#the-rules-of-references) [[The Rust Official Book|source]]

Multiple readers are fine:
```rust
fn main() {
    let message = String::from("Server started");

    let first_reader = &message;
    let second_reader = &message;

    println!("{first_reader}");
    println!("{second_reader}");
}
```
None of the references can change the string, so both can read it safely and the program would run perfectly fine

But two or more overlapping mutable references won't work:
```rust
fn main() {
    let mut message = String::from("Server started");

    let first_writer = &mut message;
    let second_writer = &mut message;

    println!("{first_writer}");
    println!("{second_writer}");
}
```

A shared reference and a mutable reference cannot overlap either:
```rust
fn main() {
    let mut message = String::from("Server started");

    let reader = &message;
    let writer = &mut message;

    println!("{reader}");
    println!("{writer}");
}
```
The reader expects the value to remain unchanged while the writer has permission to change it. Rust prevents the conflict.

```rust
fn main() {
    let mut message = String::from("Server started");

    let reader = &message;
    println!("{reader}");

    let writer = &mut message;
    writer.push_str(" successfully");

    println!("{message}");
}
```
The immutable borrow ends after its final use in the first `println!`. The mutable borrow can begin after that.

This is known as non-lexical lifetime behavior. For this article, the main thing to remember is that the compiler looks at how long a reference is actually used, not only at the surrounding braces.
