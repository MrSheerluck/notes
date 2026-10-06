---
title: Field Init Shorthand Uses a Matching Variable Name
type: note
description:
tags:
  - rust
publish: true
---
When a field and a variable have the same name, Rust lets us write that name once in a struct literal. Writing `width` there is shorthand for `width: width` [in](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#using-the-field-init-shorthand) [[The Rust Official Book|source]].

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn make_rectangle(width: u32, height: u32) -> Rectangle {
    Rectangle { width, height }
}

fn main() {
    let rectangle = make_rectangle(30, 50);
    println!("{} by {}", rectangle.width, rectangle.height);
}
```

So, the function receives variables named `width` and `height` and the struct has fields with those names, so `Rectangle {width, height}` fills both the fields from the variables. It creates the same vale as `Rectangle { width: width, height: height }`

you can try to change the parameter name from `width` to `new_width` without changing the struct literal, now if you'll do `cargo check`  it can't find a variable named `width`. Write `width: new_width` and it'll work again