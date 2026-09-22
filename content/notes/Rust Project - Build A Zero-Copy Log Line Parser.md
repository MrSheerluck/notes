---
title: "Rust Project - Build A Zero-Copy Log Line Parser"
type: note
description:
tags: []
publish: true
---

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

## Follow the ownership of one line

When the reader produces a line, the loop owns the `String`:

```rust
let line = line_result?;
```

Ownership moves into `process_line`:

```rust
process_line(line)?;
```

It moves through `normalize` and returns:

```rust
let mut line = normalize(line);
```

Validation temporarily borrows it:

```rust
validate_line(&line)?;
```

Redaction temporarily borrows it mutably:

```rust
redact_token(&mut line)?;
```

The parser then creates slices into the final version of the string:

```rust
let (timestamp, level, message) = parse_fields(&line)?;
```

Those slices are used while `line` is still alive.

Once `process_line` finishes, the slices are no longer needed. The owned `String` then goes out of scope and Rust releases its memory.
