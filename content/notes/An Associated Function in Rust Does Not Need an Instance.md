---
title: An Associated Function in Rust Does Not Need an Instance
type: note
description:
tags:
  - rust
publish: true
---
A function inside an `impl` block that does not have a `self` parameter is an associated function rather than a method. We call it with `Type::function(...)`. Constructors are often named `new`, but Rust does not treat that name specially [in](https://doc.rust-lang.org/book/ch05-03-method-syntax.html#associated-functions) [[The Rust Official Book|source]].

```rust
struct Circle {
    radius: u32,
}

impl Circle {
    fn new(radius: u32) -> Self {
        Self { radius }
    }
}

fn main() {
    let circle = Circle::new(8);
    println!("Radius: {}", circle.radius);
}
```

Inside `impl Circle`, `Self` means `Circle`. There is no circle instance yet when we call `Circle::new(8)`, so the function constructs and returns one.

This can feel like class methods in some other languages