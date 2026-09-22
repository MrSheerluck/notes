---
title: "Rust String Slice Indices Refer To UTF-8 Byte Boundaries"
type: note
description:
tags: []
publish: true
---

Rust strings contain UTF-8 data and slice indices therefore refer to byte positions and both ends of the range must fall on valid UTF-8 character boundaries [in](https://doc.rust-lang.org/book/ch08-02-strings.html#indexing-into-strings) [[The Rust Official Book|source]]

To explain it a little bit, for ASCII text, each character occupies one byte
```text
I N F O
0 1 2 3
```
So this is valid:

```rust
let level = "INFO";
let slice = &level[0..4];
```

Some Unicode characters occupy multiple bytes:

```rust
let text = String::from("नमस्ते");
```

A range such as `&text[0..1]` may stop in the middle of an encoded character. Rust will panic rather than produce an invalid string slice.

Our parser will avoid guessing field positions using arbitrary numeric indices. It will locate ASCII separators such as spaces and prefixes such as `token=`.

The timestamp, level, field names, and token in our format are expected to be ASCII. The message itself may contain any valid UTF-8 text.
