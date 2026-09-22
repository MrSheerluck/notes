---
title: "A Mutable Reference Gives Temporary Permission To Change A Value"
type: note
description:
tags: []
publish: true
---

A shared reference like `&String` or `&str` only allows reading but to modify a borrowed value, we need a mutable reference written as `&mut T` [in](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#mutable-references)  [[The Rust Official Book|source]]
```rust
fn append_status(message: &mut String) {
    message.push_str(" [processed]");
}

fn main() {
    let mut message = String::from("Server started");

    append_status(&mut message);

    println!("{message}");
}
```
So, here
```rust
let mut message = String::from("Server started");
```
the owner allows the value to be changed (we learned about it in first article)

then, we create a mutable reference
```rust
&mut message
```
 finally, the function receives temporary write access
```rust
message: &mut String
```
The function still does not own the `String`. Once the mutable borrow ends, the original owner can use the modified value again.
