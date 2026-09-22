---
title: "Rust Drops An Owned Value When its Owner Leaves Scope"
type: note
description:
tags: []
publish: true
---

A variable is valid from the point where it is defined until the end of its scope [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variable-scope) [[The Rust Official Book|source]]
Let's understand this concept with an example walkthrough as well.

Curly braces can create a scope, let me show you what I mean by that:
```rust
fn main() {
	{
		let message = String::from("Server started");
		println!("{message}");
	}
	
	// `message` no longer exists here
}
```
The string `message` is created inside the inner block. As long as execution remains inside that block, we can use `message` but once the execution reaches the closing brace, `message` is dropped and its heap allocation is cleaned up. You'll get an error if you try to run this:
```rust
fn main() {
	{
		let message = String::from("Server started");
		
	}
	
	println!("{message}");
}
```

Now, lets look at another scenario where you are returning an owned value from a function:
```rust
fn create_message() -> String {
    let message = String::from("Server started");
    message
}

fn main() {
    let message = create_message();
    println!("{message}");
}
```
The local variable inside `create_message` disappears when the function finishes but the `String` is not destroyed there. Ownership of the value is returned to the caller and stored in the new `message` variable
