---
title: An impl Block Gives a Rust Struct Methods
type: note
description:
tags:
  - rust
publish: true
---
A method is defined in an `impl` block and is called on an instance with dot syntax. Its first parameter is a form of `self`, which represents the instance receiving the call [in](https://doc.rust-lang.org/book/ch05-03-method-syntax.html#method-syntax) [[The Rust Official Book|source]].

This must feel very similar to other languages that support struct or classes and methods

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rectangle = Rectangle {
        width: 30,
        height: 50,
    };

    println!("Area: {}", rectangle.area());
    println!("Width: {}", rectangle.width);
}
```

`impl Rectangle` groups this behavior with the `Rectangle` type. The `area` method reads the fields of the particular instance on which we call it. We write `rectangle.area()` rather than passing `rectangle` as an explicit argument. `&self` means the method borrows that instance, so the next line can still use `rectangle`