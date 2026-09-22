---
title: A slice borrows from its source
type: note
description: A Rust slice cannot outlive the data it refers to.
tags:
  - rust
  - ownership
publish: true
---

A slice points into an existing string, so the normal borrowing rules apply to both the slice and its source. The compiler prevents the source from being invalidated while the slice is still in use.

This is why clearing a `String` after taking a slice from it is rejected when that slice is used later: the mutation could invalidate the borrowed range.

> [!source] Source
> [[The Rust Programming Language]] [in](https://doc.rust-lang.org/book/ch04-03-slices.html#the-slice-type)
