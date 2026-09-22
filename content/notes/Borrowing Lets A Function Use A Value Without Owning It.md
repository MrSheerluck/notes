---
title: "Borrowing Lets A Function Use A Value Without Owning It"
type: note
description:
tags: []
publish: true
---

Ok, so moving a string into a function makes sense when the function should own it but many functions only need to look at a value temporarily and passing ownership into every one of those functions would become annoying very quickly

To get rid of this annoying situation, we will use the concept of reference

A reference gives access to a value without transferring ownership and creating a reference is called *borrowing* [in](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#references-and-borrowing) [[The Rust Official Book|source]]
```rust
fn calculate_length(message: &String) -> usize {
    message.len()
}

fn main() {
    let message = String::from("Server started");

    let length = calculate_length(&message);

    println!("{message}");
    println!("Length: {length}");
}
```
In the `calculate_length` function, the expression `&message` creates a reference. The function can use the string throughout that reference but it does not own the string

![[function-borrowing]]

When `calculate_length` finishes, the reference goes away and the original `String` remains because ownership never went away from the `main` function

> When a function only needs read text, accepting `&str` is usually more flexible than accepting `&String`

```rust
fn inspect(message: &str) {
    println!("{message}");
}
```
