---
title: "Cloning A String Creates Another Owned Allocation"
type: note
description:
tags: []
publish: true
---

Sometimes we really need two independent strings. In that case, we can clone a value using the `clone()` method [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-clone) [[The Rust Official Book|source]]
```rust
fn main() {
    let first = String::from("Server started");
    let second = first.clone();

    println!("{first}");
    println!("{second}");
}
```
If you'll run this, this will run perfectly fine because they own separate strings. The strings contain the same text but the heap data has been copied.

![[rust-clone]]

This gives us independent ownership but cloning has a cost. Rust may beed to allocate more memory and copy all the bytes. Cloning is completely fine when we need independent data but it should not be the automatic response to every ownership error, though. If a function only needs to inspect a value temporarily, then Rust Borrowing often describes that intention better and avoids extra allocation
