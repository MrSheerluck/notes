---
title: A Method Receiver in Rust Says How It Uses the Instance
type: note
description:
tags:
  - rust
publish: true
---
The receiver can be `&self` to read, `&mut self` to change the instance, or `self` to take ownership of it. These are the borrowing and moving rules from the previous article applied to a method's first parameter [in](https://doc.rust-lang.org/book/ch05-03-method-syntax.html#method-syntax) [[The Rust Official Book|source]].

```rust
struct Counter {
    value: u32,
}

impl Counter {
    fn current(&self) -> u32 {
        self.value
    }

    fn add(&mut self, amount: u32) {
        self.value += amount;
    }

    fn into_value(self) -> u32 {
        self.value
    }
}

fn main() {
    let mut counter = Counter { value: 10 };

    println!("Before: {}", counter.current());
    counter.add(5);
    let final_value = counter.into_value();
    println!("After: {final_value}");
}
```

`current` only reads the counter. `add` changes it, so the binding in `main` must be mutable. `into_value` consumes the counter and returns its stored value. Try calling `counter.current()` after `into_value()`; the compiler rejects it because `counter` was moved into that method.

This example is about choosing a receiver for a method. The underlying read, mutable borrow, and move behavior is the same behavior we already studied with ordinary functions.

