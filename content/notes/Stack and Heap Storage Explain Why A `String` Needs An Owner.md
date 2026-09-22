---
title: "Stack and Heap Storage Explain Why A `String` Needs An Owner"
type: note
description:
tags: []
publish: true
---

Rust's Ownership concept becomes easier to understand once we look at how Rust stores data.

In Rust, values with a fixed size known at compile time can usually be stored directly on the stack. We use Heap when the amount of data may change while the program is running [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#the-stack-and-the-heap) [[The Rust Official Book|source]]
Let's look at an example:
```rust
let age = 25;
let name = String::from("Alice");
```
Rust knows the size of an integer such as `i32`. That size won't change depending on the number stored inside it, hence this will be stored in a Stack data structure

But for the `String`, its different. It may contain five characters, fifty characters or several megabytes of text. We don't know the exact size of this at compile time, hence it'll use heap for data storage.

The `String` value keeps track of three pieces of information:
- A pointer to the string data
- The current length
- The capacity of the allocation
The metadata has a known size, so it can stay on the stack but the actual string bytes are stored on the heap

![[rust-stack-heap]]

For this `String` "Alice", the owner is `name`. Once this goes out of scope, Rust can release the `String` "Alice" allocation from the heap
