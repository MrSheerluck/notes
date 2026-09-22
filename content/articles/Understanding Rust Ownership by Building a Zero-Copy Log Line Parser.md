---
title: Understanding Rust Ownership by Building a Zero-Copy Log Line Parser
type: article
description: In this article, we are going to learn about Rust ownership, borrowing and slices by building a zero-copy log line parser
tags:
  - rust
publish: true
previous: "[[Rust Control Flow in Practice - Build a Number Guessing Game]]"
---

Hello there, Rust Ownership is probably the first Rust concept that feels actually different if you are coming from languages like JavaScript, Python, Java or C#

Ownership concept is the reason Rust can manage memory without requiring either a garbage collector or manual memory management. Once ownership, borrowing and slices start making sense, many other parts of Rust become much easier to understand.

In this article, we will first understand all these concepts and then finally build a log line parser. I'll explain more about the project later but for now, lets start understand the concepts

![Rust Ownership Youtube video](https://youtu.be/ZxxUqoUTgnA?si=JncMNGwFSzrrY4Y0)


## Rust Uses Ownership to Decide Who is Responsible For A Value
In Rust, every value has a owner. There can be only one owner at a time and the value is dropped when that owner goes out of scope [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-rules) [[The Rust Official Book|source]]
Lets see this example to understand:
```rust
fn main() {
	let message = String::from("Server started");
}
```
So, in this example, the variable `message` owns the `String`. When execution reaches the closing brace, `message` goes out of scope and Rust knows that the string is no longer needed, so it cleans the memory owned by that string

Unlike other languages we do not need to call `free`, `delete` or some other special cleanup method, Rust will perform the cleanup automatically because it knows exactly which variable owns the value.

You can think of Rust's ownership concept as responsibility. If a variable owns a value, it is responsible for keeping that value alive. Once the owner disappears or goes out of scope, Rust can clean up the value.

This is also why Rust doesn't allow two ordinary variables to independently own the same heap allocation because if both variables believed they owned it, then both might try to clean it up and that would create a double-free error

## Stack and Heap Storage Explain Why A `String` Needs An Owner
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



## Rust Drops An Owned Value When its Owner Leaves Scope
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



## Assigning A String Moves Its Ownership
Assignment doesn't always create an independent copy in Rust. For a heap-backed type such as `String`, an assignment normally transfers ownership to the new variable [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-move) [[The Rust Official Book|source]]

```rust
fn main() {
    let first = String::from("Server started");
    let second = first;

    println!("{second}");
}
```
After this assignment, `second` owns the string. Rust copies the pointer, length and capacity into `second` but it doesn't copy all the characters into a new heap allocation and then Rust considers `first` invalid. So, if you'll run this code, then the compiler will complain:

```rust
fn main() {
    let first = String::from("Server started");
    let second = first;

    println!("{first}");
    println!("{second}");
}
```

![[rust-move]]

A move is usually much cheaper than copying all the underlying data. If the string contained ten megabytes of log data, the move would transfer responsibility for the existing allocation, it would not copy those ten megabytes into another allocation, we call this *Rust Move Semantics*


## Cloning A String Creates Another Owned Allocation
Sometimes we really need two independent strings. In that case, we can clone a value using the `clone()` method [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-clone) [[The Rust Official Book|source]]
```rust
fn main() {
    let first = String::from("Server started");
    let second = first.clone();

    println!("{first}");
    println!("{second}");
}
```
If you'll run this, this will run perfectly fine because they own separate strings. The strings contain the same text but the heap data has been copied.

![[rust-clone]]

This gives us independent ownership but cloning has a cost. Rust may beed to allocate more memory and copy all the bytes. Cloning is completely fine when we need independent data but it should not be the automatic response to every ownership error, though. If a function only needs to inspect a value temporarily, then Rust Borrowing often describes that intention better and avoids extra allocation




## Values Implementing Copy Remain Usable After Assignment
In Rust, integers do not behave like `String` during assignment, for example:
```rust
fn main() {
    let first = 42;
    let second = first;

    println!("{first}");
    println!("{second}");
}
```
This will compile perfectly fine because integers implement the `Copy` trait. We will understand about traits later [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#stack-only-data-copy) [[The Rust Official Book|source]]

But in simple terms, Rust duplicates the value `42`, so both variables remain usable. There is no shared heap allocation for the two variables. Copying the integer is also inexpensive because its size is small and fixed. 

Common `Copy` types include integers, floating-point values, booleans, characters, shared references, and tuples contains only other `Copy` values



## Passing An Owned Value Into A Function Can Move It
In Rust, function parameters are variables too, so passing a value into a function follows the same ownership rules as assignment [in](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-and-functions) [[The Rust Official Book|source]]
```rust
fn print_message(message: String) {
    println!("{message}");
}

fn main() {
    let message = String::from("Server started");

    print_message(message);
}
```
Here, calling the `print_message(message)` moves the `String` into the function parameter. So, if you'll try the following program, it won't work:
```rust
fn main() {
    let message = String::from("Server started");

    print_message(message);

    println!("{message}");
}
```
The Rust compiler will scream that `message` was used after being moved.

But as we have seen before, we can return the ownership to its caller as well:
```rust
fn print_and_return(message: String) -> String {
    println!("{message}");
    message
}

fn main() {
    let message = String::from("Server started");
    let message = print_and_return(message);

    println!("{message}");
}
```
Here, we are returning `message` from `print_and_return()` method and then the ownership gets to the `message` variable that is in the `main` function [source](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#return-values-and-scope)

That's why, when you'll print `message`, this will work completely fine.

## Borrowing Lets A Function Use A Value Without Owning It
Ok, so moving a string into a function makes sense when the function should own it but many functions only need to look at a value temporarily and passing ownership into every one of those functions would become annoying very quickly

To get rid of this annoying situation, we will use the concept of reference

A reference gives access to a value without transferring ownership and creating a reference is called *borrowing* [in](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#references-and-borrowing) [[The Rust Official Book|source]]
```rust
fn calculate_length(message: &String) -> usize {
    message.len()
}

fn main() {
    let message = String::from("Server started");

    let length = calculate_length(&message);

    println!("{message}");
    println!("Length: {length}");
}
```
In the `calculate_length` function, the expression `&message` creates a reference. The function can use the string throughout that reference but it does not own the string

![[function-borrowing]]

When `calculate_length` finishes, the reference goes away and the original `String` remains because ownership never went away from the `main` function

> When a function only needs read text, accepting `&str` is usually more flexible than accepting `&String`

```rust
fn inspect(message: &str) {
    println!("{message}");
}
```


## A Mutable Reference Gives Temporary Permission To Change A Value
A shared reference like `&String` or `&str` only allows reading but to modify a borrowed value, we need a mutable reference written as `&mut T` [in](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#mutable-references)  [[The Rust Official Book|source]]
```rust
fn append_status(message: &mut String) {
    message.push_str(" [processed]");
}

fn main() {
    let mut message = String::from("Server started");

    append_status(&mut message);

    println!("{message}");
}
```
So, here
```rust
let mut message = String::from("Server started");
```
the owner allows the value to be changed (we learned about it in first article)

then, we create a mutable reference
```rust
&mut message
```
 finally, the function receives temporary write access
```rust
message: &mut String
```
The function still does not own the `String`. Once the mutable borrow ends, the original owner can use the modified value again.

## Rust Allows Many Readers or One Writer At A Time
This is actually important to understand. Rust does not allow arbitrary combinations of references. At a particular time, we can have any number of immutable references or one mutable reference [in](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#the-rules-of-references) [[The Rust Official Book|source]]

Multiple readers are fine:
```rust
fn main() {
    let message = String::from("Server started");

    let first_reader = &message;
    let second_reader = &message;

    println!("{first_reader}");
    println!("{second_reader}");
}
```
None of the references can change the string, so both can read it safely and the program would run perfectly fine

But two or more overlapping mutable references won't work:
```rust
fn main() {
    let mut message = String::from("Server started");

    let first_writer = &mut message;
    let second_writer = &mut message;

    println!("{first_writer}");
    println!("{second_writer}");
}
```

A shared reference and a mutable reference cannot overlap either:
```rust
fn main() {
    let mut message = String::from("Server started");

    let reader = &message;
    let writer = &mut message;

    println!("{reader}");
    println!("{writer}");
}
```
The reader expects the value to remain unchanged while the writer has permission to change it. Rust prevents the conflict.

```rust
fn main() {
    let mut message = String::from("Server started");

    let reader = &message;
    println!("{reader}");

    let writer = &mut message;
    writer.push_str(" successfully");

    println!("{message}");
}
```
The immutable borrow ends after its final use in the first `println!`. The mutable borrow can begin after that.

This is known as non-lexical lifetime behavior. For this article, the main thing to remember is that the compiler looks at how long a reference is actually used, not only at the surrounding braces.



## Rust Prevents References From Outliving Their Owners
A reference is only valid while the value it points to still exists. Rust prevents us from returning a reference to a local value that is about to be destroyed [in](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#the-rules-of-references) [[The Rust Official Book|source]]. The function will not compile:
```rust
fn create_message() -> &String {
    let message = String::from("Server started");
    &message
}
```
`message` is dropped when the function ends. Returning a reference to it would leave the caller with a reference pointing to invalid memory

![[rust-prevents-dangling-reference]]


Returning the owned value fixes the problem:
```rust
fn create_message() -> String {
    String::from("Server started")
}
```
Ownership goes back to the caller so the value stays alive



## A String Slice Borrows Part of Existing String Data
A string slice lets us work with some or all of a string without creating another owned `String`. The type of a string slice is `&str` [in](https://doc.rust-lang.org/book/ch04-03-slices.html#string-slices) [[The Rust Official Book|source]]
```rust
let message = String::from("Server started");
let first_word = &message[0..6];
```
Here, the `first_word` doesn't own another copy of "Server", it refers to the first six bytes inside message



We can borrow the entire string as a slice too:
```rust
let message = String::from("Server started");

let whole: &str = &message[..];
let part: &str = &message[0..6];
```

A string literal is also a `&str`:
```rust
let message: &str = "Server started";
```


## A Live String Slice Restricts Mutation Of Its Source
A slice points into an existing string, so the normal borrowing rules apply to both the slice and its source [in](https://doc.rust-lang.org/book/ch04-03-slices.html#the-slice-type) [[The Rust Official Book|source]]. For example, lets take this:
```rust
fn main() {
    let mut line = String::from("INFO Server started");

    let level = &line[0..4];

    line.clear();

    println!("{level}");
}
```
This won't compile because `level` refers to bytes inside `line`. So, calling `line.clear()` could invalidate that reference, but `level` is still used afterwards

Rust rejects the mutation instead of letting us keep a broken slice



## Rust String Slice Indices Refer To UTF-8 Byte Boundaries
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

## Rust Project - Build A Zero-Copy Log Line Parser
Now we can connect the concepts in one project by build a zero-copy log line parser. The program will read log lines like this:
```text
2026-09-15T10:20:30Z INFO token=abc123 message=Server started
2026-09-15T10:21:04Z WARN token=user-456 message=Disk usage is above 80%
2026-09-15T10:22:17Z ERROR token=secret-token message=Database connection failed
```

## Create The Project
```bash
cargo new zero-copy-log-parser
```

Create a `sample.log` file in the project directory:
```text
2026-09-15T10:20:30Z INFO token=abc123 message=Server started
2026-09-15T10:21:04Z WARN token=user-456 message=Disk usage is above 80%
2026-09-15T10:22:17Z ERROR token=secret-token message=Database connection failed
2026-09-15T10:23:40Z DEBUG token=local-dev message=Cache entry refreshed
```

The expected format is:

```text
<TIMESTAMP> <LEVEL> token=<TOKEN> message=<MESSAGE>
```

The first three spaces separate the main fields. Any spaces after `message=` belong to the message itself.

## Start By Reading Owned Log Lines
Open `src/main.rs` and start with this:

```rust
use std::fs::File;
use std::io::{BufRead, BufReader};

fn main() {
    let file = File::open("sample.log")
        .expect("could not open sample.log");

    let reader = BufReader::new(file);

    for line_result in reader.lines() {
        let line = line_result.expect("could not read line");
        println!("{line}");
    }
}
```

Run it:
```bash
cargo run
```

The important variable is `line`:
```rust
let line = line_result.expect("could not read line");
```

Its type is `String` so the loop owns the line. `BufRead::lines` returns an iterator over the lines being read. Each of these successfully read item is an owned `String` without the ending newline or carriage return

## Move Each Line Into A Processing Function

Add this function:
```rust
fn process_line(line: String) {
    println!("{line}");
}
```

Then call it from the loop:
```rust
for line_result in reader.lines() {
    let line = line_result.expect("could not read line");
    process_line(line);
}
```

Calling `process_line(line)` moves the `String` into the function.

If we try to use the original variable afterwards:
```rust
process_line(line);
println!("{line}");
```

Rust rejects the program because ownership has already moved. The loop does not need the string again, so moving it is the correct behaviour.

## Move The Owned Line Through Normalisation
A log line may have trailing whitespace. We will remove it before parsing:

```rust
fn normalize(mut line: String) -> String {
    let trimmed_length = line.trim_end().len();
    line.truncate(trimmed_length);
    line
}
```

`normalize` takes ownership, changes the owned string, and returns ownership.

`trim_end` returns a borrowed view with trailing whitespace removed. It does not modify the source string.

`String::truncate` shortens the actual owned string. The supplied length must fall on a valid UTF-8 boundary.

Use it in `process_line`:

```rust
fn process_line(line: String) {
    let line = normalize(line);
    println!("{line}");
}
```

The `String` moves into `normalize` and then returns to `process_line`


## Parse The Fields As Borrowed Slices
Add the parser
```rust
fn parse_fields(
    line: &str,
) -> Result<(&str, &str, &str), String> {
    let mut parts = line.splitn(4, ' ');

    let timestamp = parts
        .next()
        .ok_or_else(|| "missing timestamp".to_string())?;

    let level = parts
        .next()
        .ok_or_else(|| "missing log level".to_string())?;

    let token_field = parts
        .next()
        .ok_or_else(|| "missing token field".to_string())?;

    let message_field = parts
        .next()
        .ok_or_else(|| "missing message field".to_string())?;

    let token = token_field
        .strip_prefix("token=")
        .ok_or_else(|| {
            "token field must start with `token=`".to_string()
        })?;

    let message = message_field
        .strip_prefix("message=")
        .ok_or_else(|| {
            "message field must start with `message=`".to_string()
        })?;

    if token.is_empty() {
        return Err("token cannot be empty".to_string());
    }

    if message.is_empty() {
        return Err("message cannot be empty".to_string());
    }

    Ok((timestamp, level, message))
}
```
`splitn(4, ' ')` produces at most four sections.
That limit matters because the message may contain spaces:

```text
message=Database connection failed
```

The first three spaces separate the structural fields. Everything after that remains part of the message field.

`strip_prefix` removes a prefix when it is present and returns a slice of the remaining text.

For example:

```rust
let field = "message=Server started";
let message = field.strip_prefix("message=");
```

The result is:

```rust
Some("Server started")
```

No new `String` is allocated for the message.

The returned slices borrow from `line`. Written with the inferred lifetime made explicit, the signature would look like this:

```rust
fn parse_fields<'a>(
    line: &'a str,
) -> Result<(&'a str, &'a str, &'a str), String>
```

We do not need to write that lifetime because there is only one borrowed input. Rust can infer that the returned references came from `line`.

## Borrow The Line for Validation
Add a validation function:

```rust
fn validate_line(line: &str) -> Result<(), String> {
    let (timestamp, level, message) = parse_fields(line)?;

    if timestamp.len() != 20
        || !timestamp.contains('T')
        || !timestamp.ends_with('Z')
    {
        return Err(format!("invalid timestamp `{timestamp}`"));
    }

    if !matches!(level, "DEBUG" | "INFO" | "WARN" | "ERROR") {
        return Err(format!("unsupported log level `{level}`"));
    }

    if message.trim().is_empty() {
        return Err("message cannot be empty".to_string());
    }

    Ok(())
}
```

`validate_line` accepts `&str`, so it only borrows the line.

Use it inside `process_line`:

```rust
fn process_line(line: String) -> Result<(), String> {
    let line = normalize(line);

    validate_line(&line)?;

    let (timestamp, level, message) = parse_fields(&line)?;

    println!("{level:<5} {timestamp} | {message}");

    Ok(())
}
```

The line remains owned by `process_line`. Validation and parsing only borrow it.

## Mutably Borrow The Line to Redact The Token
Add the redaction function:

```rust
fn redact_token(line: &mut String) -> Result<(), String> {
    let marker = "token=";

    let token_start = line
        .find(marker)
        .ok_or_else(|| "missing token field".to_string())?
        + marker.len();

    let remaining = &line[token_start..];

    let token_length = remaining
        .find(' ')
        .unwrap_or(remaining.len());

    let token_end = token_start + token_length;

    if token_start == token_end {
        return Err("token cannot be empty".to_string());
    }

    let mask = "*".repeat(
        line[token_start..token_end].chars().count(),
    );

    line.replace_range(token_start..token_end, &mask);

    Ok(())
}
```

`find` returns the byte index where the matching pattern begins.

source: in [[Rust Standard Library Documentation]] → `[str::find](https://doc.rust-lang.org/std/primitive.str.html#method.find)`

Once we know where `token=` begins, we can calculate the range occupied by the token. `replace_range` replaces that range inside the owned `String`.

source: in [[Rust Standard Library Documentation]] → `[String::replace_range](https://doc.rust-lang.org/std/string/struct.String.html#method.replace_range)`

Notice that `remaining` is an immutable slice:

```rust
let remaining = &line[token_start..];
```

We later mutate `line`:

```rust
line.replace_range(token_start..token_end, &mask);
```

This compiles because `remaining` is not used after the token length is calculated. Its borrow ends before the mutation begins.

If we tried to print `remaining` after `replace_range`, the compiler would reject the mutation because the slice could have been invalidated.

## Keep Validation, Mutation, and Final Slicing In The Right Order
pdate `process_line`:

```rust
fn process_line(line: String) -> Result<(), String> {
    let mut line = normalize(line);

    validate_line(&line)?;

    redact_token(&mut line)?;

    let (timestamp, level, message) = parse_fields(&line)?;

    println!("{level:<5} {timestamp} | {message}");

    Ok(())
}
```

The order matters:

```text
Owned String
    │
    ├── immutable borrow for validation
    │          borrow ends
    │
    ├── mutable borrow for redaction
    │          borrow ends
    │
    └── immutable slices for output
```

Creating the final slices before redaction would fail:

```rust
let (timestamp, level, message) = parse_fields(&line)?;

redact_token(&mut line)?;

println!("{timestamp} {level} {message}");
```

The slices are still needed after `redact_token`, so the immutable borrow overlaps the mutable borrow.

The compiler makes us finish changing the string before keeping references into its contents.

## Confirm that the slices point into the original line

After parsing, calculate the offset of each slice:

```rust
let base_address = line.as_ptr() as usize;

let timestamp_offset =
    timestamp.as_ptr() as usize - base_address;

let level_offset =
    level.as_ptr() as usize - base_address;

let message_offset =
    message.as_ptr() as usize - base_address;
```

`String::as_ptr` returns a pointer to the beginning of the string’s byte buffer.

source: in [[Rust Standard Library Documentation]] → `[String::as_ptr](https://doc.rust-lang.org/std/string/struct.String.html#method.as_ptr)`

We are not dereferencing the raw pointers. We only compare their numeric addresses to see where the slices begin inside the original string.

## Complete program

```rust
use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::process;

fn normalize(mut line: String) -> String {
    let trimmed_length = line.trim_end().len();
    line.truncate(trimmed_length);
    line
}

fn parse_fields(
    line: &str,
) -> Result<(&str, &str, &str), String> {
    let mut parts = line.splitn(4, ' ');

    let timestamp = parts
        .next()
        .ok_or_else(|| "missing timestamp".to_string())?;

    let level = parts
        .next()
        .ok_or_else(|| "missing log level".to_string())?;

    let token_field = parts
        .next()
        .ok_or_else(|| "missing token field".to_string())?;

    let message_field = parts
        .next()
        .ok_or_else(|| "missing message field".to_string())?;

    let token = token_field
        .strip_prefix("token=")
        .ok_or_else(|| {
            "token field must start with `token=`".to_string()
        })?;

    let message = message_field
        .strip_prefix("message=")
        .ok_or_else(|| {
            "message field must start with `message=`".to_string()
        })?;

    if token.is_empty() {
        return Err("token cannot be empty".to_string());
    }

    if message.is_empty() {
        return Err("message cannot be empty".to_string());
    }

    Ok((timestamp, level, message))
}

fn validate_line(line: &str) -> Result<(), String> {
    let (timestamp, level, message) = parse_fields(line)?;

    if timestamp.len() != 20
        || !timestamp.contains('T')
        || !timestamp.ends_with('Z')
    {
        return Err(format!("invalid timestamp `{timestamp}`"));
    }

    if !matches!(level, "DEBUG" | "INFO" | "WARN" | "ERROR") {
        return Err(format!("unsupported log level `{level}`"));
    }

    if message.trim().is_empty() {
        return Err("message cannot be empty".to_string());
    }

    Ok(())
}

fn redact_token(line: &mut String) -> Result<(), String> {
    let marker = "token=";

    let token_start = line
        .find(marker)
        .ok_or_else(|| "missing token field".to_string())?
        + marker.len();

    let remaining = &line[token_start..];

    let token_length = remaining
        .find(' ')
        .unwrap_or(remaining.len());

    let token_end = token_start + token_length;

    if token_start == token_end {
        return Err("token cannot be empty".to_string());
    }

    let mask = "*".repeat(
        line[token_start..token_end].chars().count(),
    );

    line.replace_range(token_start..token_end, &mask);

    Ok(())
}

fn process_line(line: String) -> Result<(), String> {
    let mut line = normalize(line);

    validate_line(&line)?;
    redact_token(&mut line)?;

    let (timestamp, level, message) = parse_fields(&line)?;

    let base_address = line.as_ptr() as usize;

    let timestamp_offset =
        timestamp.as_ptr() as usize - base_address;

    let level_offset =
        level.as_ptr() as usize - base_address;

    let message_offset =
        message.as_ptr() as usize - base_address;

    println!(
        "{level:<5} {timestamp} | {message} \
         [offsets: timestamp={timestamp_offset}, \
         level={level_offset}, message={message_offset}]"
    );

    Ok(())
}

fn run() -> Result<(), String> {
    let path = env::args()
        .nth(1)
        .ok_or_else(|| {
            "usage: zero-copy-log-parser <log-file>".to_string()
        })?;

    let file = File::open(&path)
        .map_err(|error| {
            format!("could not open `{path}`: {error}")
        })?;

    let reader = BufReader::new(file);

    for (index, line_result) in reader.lines().enumerate() {
        let line_number = index + 1;

        let line = line_result.map_err(|error| {
            format!("could not read line {line_number}: {error}")
        })?;

        process_line(line).map_err(|error| {
            format!("line {line_number}: {error}")
        })?;
    }

    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("error: {error}");
        process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normalizes_trailing_whitespace() {
        let line = String::from(
            "2026-09-15T10:20:30Z INFO \
             token=abc message=Started   ",
        );

        let normalized = normalize(line);

        assert_eq!(
            normalized,
            "2026-09-15T10:20:30Z INFO \
             token=abc message=Started"
        );
    }

    #[test]
    fn parses_fields_as_slices() {
        let line = String::from(
            "2026-09-15T10:20:30Z INFO \
             token=abc123 message=Server started",
        );

        let (timestamp, level, message) =
            parse_fields(&line).unwrap();

        assert_eq!(timestamp, "2026-09-15T10:20:30Z");
        assert_eq!(level, "INFO");
        assert_eq!(message, "Server started");

        let base = line.as_ptr() as usize;
        let end = base + line.len();

        for field in [timestamp, level, message] {
            let address = field.as_ptr() as usize;

            assert!(address >= base);
            assert!(address < end);
        }
    }

    #[test]
    fn redacts_token_in_place() {
        let mut line = String::from(
            "2026-09-15T10:20:30Z INFO \
             token=abc123 message=Server started",
        );

        redact_token(&mut line).unwrap();

        assert_eq!(
            line,
            "2026-09-15T10:20:30Z INFO \
             token=****** message=Server started"
        );
    }

    #[test]
    fn rejects_an_unknown_level() {
        let line = String::from(
            "2026-09-15T10:20:30Z TRACE \
             token=abc message=Started",
        );

        let result = validate_line(&line);

        assert_eq!(
            result,
            Err("unsupported log level `TRACE`".to_string())
        );
    }
}
```

## Run the project

Run the tests first:

```bash
cargo test
```

Then run the parser:

```bash
cargo run -- sample.log
```

You should get output similar to:

```text
INFO  2026-09-15T10:20:30Z | Server started [offsets: timestamp=0, level=21, message=47]
WARN  2026-09-15T10:21:04Z | Disk usage is above 80% [offsets: timestamp=0, level=21, message=49]
ERROR 2026-09-15T10:22:17Z | Database connection failed [offsets: timestamp=0, level=21, message=57]
DEBUG 2026-09-15T10:23:40Z | Cache entry refreshed [offsets: timestamp=0, level=21, message=51]
```

The offsets show where each slice begins inside the owned line. The message offset changes because the tokens have different lengths.

Ok so that's the end of this article. I hope you liked it. In the next article, we will build a **token bucket rate limiter** and learn about structs 
