---
title: "Passing An Owned Value Into A Function Can Move It"
type: note
description:
tags: []
publish: true
---

In Rust, function parameters are variables too, so passing a value into a function follows the same ownership rules as assignment [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-and-functions) [[The Rust Official Book|source]]
```rust
fn print_message(message: String) {
    println!("{message}");
}

fn main() {
    let message = String::from("Server started");

    print_message(message);
}
```
Here, calling the `print_message(message)` moves the `String` into the function parameter. So, if you'll try the following program, it won't work:
```rust
fn main() {
    let message = String::from("Server started");

    print_message(message);

    println!("{message}");
}
```
The Rust compiler will scream that `message` was used after being moved.

But as we have seen before, we can return the ownership to its caller as well:
```rust
fn print_and_return(message: String) -> String {
    println!("{message}");
    message
}

fn main() {
    let message = String::from("Server started");
    let message = print_and_return(message);

    println!("{message}");
}
```
Here, we are returning `message` from `print_and_return()` method and then the ownership gets to the `message` variable that is in the `main` function [source](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#return-values-and-scope)

That's why, when you'll print `message`, this will work completely fine.
