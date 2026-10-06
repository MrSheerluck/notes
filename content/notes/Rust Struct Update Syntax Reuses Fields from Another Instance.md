---
title: Rust Struct Update Syntax Reuses Fields from Another Instance
type: note
description:
tags:
  - rust
publish: true
---
The `..existing` syntax fills unspecified fields of a new struct instance from an existing instance of the same type. It still follows the ownership rules we learned last time: a non-Copy field can move into the new value  [in](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#creating-instances-with-struct-update-syntax) [[The Rust Official Book|source]]

```rust
struct Profile {
    name: String,
    city: String,
    age: u8,
}

fn main() {
    let original = Profile {
        name: String::from("Asha"),
        city: String::from("Pune"),
        age: 24,
    };

    let updated = Profile {
        city: String::from("Bengaluru"),
        ..original
    };

    println!("{}, {}, {}", updated.name, updated.city, updated.age);
}
```

Here, we are creating a struct `Profile` with `name`, `city` and `age` as fields. Then in `main`, we are creating an instance of it called `original` with some values for its fields, then we are creating another instance of this struct called `updated` and in this we are specifying `city` field value but for the rest of the fields we are writing `..original`, this moves the string from `original.name` to `updated.name` but for `original.age`, it gets copied to `updated.age` as its a `u8`. 

If you want to confirm that move operation actually happened, try adding  `println!("{}", original.name);` after creating the `updated` and run `cargo check`, you'll get an error. Rust rejects that line because the name moved. Struct update syntax saves repetition; it does not clone the reused fields.

