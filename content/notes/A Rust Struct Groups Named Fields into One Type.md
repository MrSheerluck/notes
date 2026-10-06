---
title: A Rust Struct Groups Named Fields into One Type
type: note
description:
tags:
  - go
publish: true
---
A struct defines a type whose fields have names and types. An instance is a value of that type, with a value supplied for every field (I'll explain with an example, this statement might have confused you a little). We access a field with a dot followed by its name [in](https://doc.rust-lang.org/book/ch05-01-defining-structs.html) [[The Rust Official Book|source]].

```rust
struct Book {
    title: String,
    pages: u32,
}

fn main() {
    let book = Book {
        title: String::from("The Hobbit"),
        pages: 310,
    };

    println!("{} has {} pages", book.title, book.pages);
}
```
So here the `struct Book` defines the type, `Book { ... }` creates one instance, this is very similar to other languages like C and Go where they have structs. The field names tell us what the two values represent. `book.pages` reads the page count without requiring us to remember a tuple position

Try removing `pages: 310` from the struct literal and run `cargo check`. Rust tells you that the instance is missing a field. Put it back, then give `pages` a string instead of a `u32`. The compiler reports the type mismatch. A struct definition fixes the names and types that each instance must provide.

We already learned that Rust bindings are immutable by default. That rule also applies here: write `let mut book` if you later need to assign to `book.pages`. There is no separate `mut` marker on an individual field in this struct definition [in](https://doc.rust-lang.org/book/ch05-01-defining-structs.html) [[The Rust Official Book|source]].
