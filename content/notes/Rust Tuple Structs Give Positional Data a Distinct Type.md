---
title: Rust Tuple Structs Give Positional Data a Distinct Type
type: note
description:
tags:
  - rust
publish: true
---
A tuple struct has a name and positional fields. Each tuple struct definition creates its own type, even when another tuple struct contains the same field types [in](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#creating-different-types-with-tuple-structs) [[The Rust Official Book|source]]

```rust
struct Meters(u32);
struct Seconds(u32);

fn print_distance(distance: Meters) {
    println!("{} meters", distance.0);
}

fn main() {
    let distance = Meters(100);
    let time = Seconds(20);

    print_distance(distance);
    println!("{} seconds", time.0);
}
```

We access a tuple struct field by position, so `distance.0` is its first field. `Meters(100)` and `Seconds(20)` both contain a `u32`, but `Meters` and `Seconds` are different types. Replace `print_distance(distance)` with `print_distance(time)` and run `cargo check` to see the mismatch.

A named-field struct helps when the individual fields need descriptive names. A tuple struct helps when the type name carries the meaning and the fields' positions are clear.