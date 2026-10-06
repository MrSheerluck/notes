---
title: Deriving Debug in Rust Lets Us Inspect a Struct
type: note
description:
tags:
  - rust
publish: true
---
A new struct does not automatically have a display format. If we want to inspect its fields while developing, we can derive `Debug` and print it with the `{:?}` formatter [in](https://doc.rust-lang.org/book/ch05-02-example-structs.html#adding-useful-functionality-with-derived-traits) [[The Rust Official Book|source]]

```rust
#[derive(Debug)]
struct Movie {
    title: String,
    year: u16,
}

fn main() {
    let movie = Movie {
        title: String::from("Arrival"),
        year: 2016,
    };

    println!("{movie:?}");
}
```

If you'll run this, you'll get `Movie { title: "Arrival", year: 2016 }`

Remove `#[derive(Debug)]` and run `cargo check`. Rust tells us that `Movie` does not implement `Debug`. The derive attribute asks Rust to generate that implementation. `Debug` is useful for inspecting values during development; a polished format for readers is a separate choice.