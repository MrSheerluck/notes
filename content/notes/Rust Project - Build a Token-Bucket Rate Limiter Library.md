---
title: Rust Project - Build a Token-Bucket Rate Limiter Library
type: note
description:
tags:
  - rust
publish: true
---
Let's define what I mean by the title of this project before coding. A bucket has a capacity and a refill interval. It starts full and each accepted request uses one token. Every complete refill interval restores one token but the count never rises above capacity. If the bucket is empty, a request is rejected and the caller gets the remaining wait until the next token


For example, capacity 3 and a two-second refill interval mean that three requests arriving at the start can pass. A fourth request at that same instant must wait two seconds. After one second, it still has one second to wait. At two seconds, one token is available again

This is a deliberately small token bucket: it grants whole tokens at fixed intervals, has no networking or shared concurrent state, and does not sleep. The caller supplies the current `Instant` on each request. That lets us test time behaviour without waiting for a real clock.

## Create The Project
Let's start by creating or intialising our library package:
```bash
cargo new token-bucket-limiter --lib
cd token-bucket-limiter
cargo test
```

Cargo creates `src/lib.rs` for the library. We will later add `src/main.rs` as a small program that calls it. Cargo recognizes those locations by convention source: [in](https://doc.rust-lang.org/cargo/guide/project-layout.html) [[The Cargo Book]]

The package name contains hyphens, while Rust code refers to the library as `token_bucket_limiter`. We will use that name when the demo imports our types [in](https://doc.rust-lang.org/cargo/reference/cargo-targets.html#library) [[The Cargo Book]]

For now, open `src/lib.rs` and replace Cargo's sample code

Give the configuration a struct and a constructor

Add this to `src/lib.rs`:

```rust
use std::time::Duration;

#[derive(Debug)]
pub struct RateLimitConfig {
    capacity: u32,
    refill_every: Duration,
}

impl RateLimitConfig {
    pub fn new(capacity: u32, refill_every: Duration) -> Result<Self, &'static str> {
        if capacity == 0 {
            return Err("capacity must be greater than zero");
        }
        if refill_every.is_zero() {
            return Err("refill interval must be greater than zero");
        }
        Ok(Self {
            capacity,
            refill_every,
        })
    }

    pub fn capacity(&self) -> u32 {
        self.capacity
    }

    pub fn refill_every(&self) -> Duration {
        self.refill_every
    }
}
```

`RateLimitConfig` groups the two settings. Its `new` function is the associated-function pattern we just studied: it creates the struct after checking the inputs. We already used `Result` in the guessing-game article, so here we use it to return either a valid configuration or an error message. The fields are private, which means callers must use the validating constructor rather than fill in arbitrary field values.

source: in [[The Rust Official Book]] → [Exposing Paths with the `pub` Keyword](https://doc.rust-lang.org/book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#exposing-paths-with-the-pub-keyword)

`Duration::is_zero` checks whether the interval has no elapsed time. We reject zero so that our later division by the interval is valid.

source: in [[Rust Standard Library Documentation]] → [`Duration::is_zero`](https://doc.rust-lang.org/std/time/struct.Duration.html#method.is_zero)

The two getter methods use `&self`. They let a caller read the configuration without gaining permission to change its fields. Notice the field init shorthand inside `Ok(Self { capacity, refill_every })`.

Run:

```bash
cargo check
```

At this point, the library compiles, even though it does not make any rate-limit decisions yet.

### Model the bucket's changing state

Change the import at the top of `src/lib.rs` to include `Instant`:

```rust
use std::time::{Duration, Instant};
```

Then add this below `RateLimitConfig` and its `impl` block:

```rust
#[derive(Debug)]
pub struct TokenBucket {
    config: RateLimitConfig,
    available: u32,
    last_refill: Instant,
}

impl TokenBucket {
    pub fn new(config: RateLimitConfig, now: Instant) -> Self {
        let available = config.capacity;
        Self {
            config,
            available,
            last_refill: now,
        }
    }
}
```

`config` contains the fixed rules. `available` is the changing token count. `last_refill` records the instant from which we measure the next refill. The constructor starts the bucket full by setting `available` to the capacity.

We read `config.capacity` before moving `config` into the new bucket, following the ownership rule from article three. `Instant` lets us measure elapsed time rather than a calendar date, which is what this limiter needs.

source: in [[Rust Standard Library Documentation]] → [`Instant`](https://doc.rust-lang.org/std/time/struct.Instant.html)

Run `cargo check` again. We have data and a valid starting state. Next, we need a decision method that changes the state.

### Return a structured decision

Add this struct above `TokenBucket`:

```rust
#[derive(Debug)]
pub struct Decision {
    pub allowed: bool,
    pub remaining: u32,
    pub retry_after: Option<Duration>,
}
```

`Decision` is a named result. `allowed` says what happened, `remaining` reports the tokens left, and `retry_after` contains a duration only when a request was rejected. `Option` is the standard type for a value that may be present or absent. We will study enums, including `Option`, properly in the next article; here we only need `Some(duration)` and `None` to report the result [in](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#the-option-enum-and-its-advantages-over-null-values) [[The Rust Official Book|source]].

Add this method inside `impl TokenBucket` after `new`:

```rust
pub fn try_acquire(&mut self, now: Instant) -> Decision {
    if self.available > 0 {
        self.available -= 1;
        Decision {
            allowed: true,
            remaining: self.available,
            retry_after: None,
        }
    } else {
        Decision {
            allowed: false,
            remaining: 0,
            retry_after: Some(self.config.refill_every),
        }
    }
}
```

The receiver is `&mut self` because accepting a request changes `available`. In the first branch, we spend one token and return a decision with the new count. In the second branch, we reject the request. For the moment we return the full interval as the retry time; this is accurate when all requests arrive at the starting instant. The `now` parameter is not used yet, so `cargo check` may warn about it. We will use it in the next step.

Run `cargo check`. If you change `&mut self` to `&self`, Rust rejects `self.available -= 1` because a shared borrow cannot mutate the bucket. Put `&mut self` back before continuing.

### Try a burst of requests

Create `src/main.rs`:

```rust
use std::time::{Duration, Instant};
use token_bucket_limiter::{RateLimitConfig, TokenBucket};

fn main() {
    let start = Instant::now();
    let config =
        RateLimitConfig::new(3, Duration::from_secs(2)).expect("valid rate limit configuration");
    let mut bucket = TokenBucket::new(config, start);

    for request in 1..=4 {
        let decision = bucket.try_acquire(start);
        println!(
            "request {request}: allowed={}, remaining={}, retry_after={:?}",
            decision.allowed, decision.remaining, decision.retry_after
        );
    }
}
```

`bucket` is mutable because each call to `try_acquire` takes `&mut self`. The four calls deliberately use the same `start` instant, so no time has passed between them. Run:

```bash
cargo run
```

You should see:

```text
request 1: allowed=true, remaining=2, retry_after=None
request 2: allowed=true, remaining=1, retry_after=None
request 3: allowed=true, remaining=0, retry_after=None
request 4: allowed=false, remaining=0, retry_after=Some(2s)
```

The bucket enforces its initial burst, but it cannot refill yet. That is the next method we will add.

### Refill according to elapsed time

A rate limiter needs to remember time as well as tokens. Add a private `refill` method inside `impl TokenBucket`:

```rust
fn refill(&mut self, now: Instant) {
    if self.available == self.config.capacity {
        if now > self.last_refill {
            self.last_refill = now;
        }
        return;
    }

    let elapsed = now.saturating_duration_since(self.last_refill);
    let intervals = elapsed.as_nanos() / self.config.refill_every.as_nanos();

    if intervals == 0 {
        return;
    }

    let missing = self.config.capacity - self.available;

    if intervals >= u128::from(missing) {
        self.available = self.config.capacity;
        self.last_refill = now;
    } else {
        let added = intervals as u32;
        self.available += added;
        self.last_refill += self.config.refill_every * added;
    }
}
```

There are several decisions in this method, so let's go through them one at a time.

First, a full bucket cannot store extra tokens or extra refill credit. If it has stayed full until `now`, we reset `last_refill` to `now`. Otherwise, a request that spends a token after a long idle period could get that token back almost immediately from time accumulated while the bucket was already full. This reset is part of our bucket's behavior, not a special Rust rule.

Next, `saturating_duration_since` measures how much time has passed since `last_refill`. If a caller supplies an earlier instant, it returns zero rather than a negative duration. In normal use, callers should supply successive readings from `Instant::now()`; the zero behavior keeps our simple library from inventing tokens if an earlier value is passed.

source: in [[Rust Standard Library Documentation]] → [`Instant::saturating_duration_since`](https://doc.rust-lang.org/std/time/struct.Instant.html#method.saturating_duration_since)

`as_nanos()` gives us each duration's total nanoseconds as a `u128`. Dividing elapsed nanoseconds by interval nanoseconds counts **complete** refill intervals. A one-second wait does not yet produce a token when the interval is two seconds.

source: in [[Rust Standard Library Documentation]] → [`Duration::as_nanos`](https://doc.rust-lang.org/std/time/struct.Duration.html#method.as_nanos)

If enough intervals have passed to fill every missing token, we set `available` to capacity. We cannot exceed that capacity. Otherwise, we add only the complete intervals and move `last_refill` forward by exactly those intervals. The unfinished part of the time stays available for the next call. For example, after five seconds with a two-second interval, two tokens can be restored and one second remains toward another token.

The `intervals as u32` conversion appears only in the branch where `intervals` is less than `missing`, and `missing` is a `u32`. That condition makes the conversion fit. Run `cargo check` after adding the method.

### Make each request refill before deciding

Replace the earlier `try_acquire` method with this version:

```rust
pub fn try_acquire(&mut self, now: Instant) -> Decision {
    self.refill(now);

    if self.available > 0 {
        self.available -= 1;
        Decision {
            allowed: true,
            remaining: self.available,
            retry_after: None,
        }
    } else {
        let elapsed = now.saturating_duration_since(self.last_refill);
        Decision {
            allowed: false,
            remaining: 0,
            retry_after: Some(self.config.refill_every - elapsed),
        }
    }
}
```

Now `now` has a job. The method refills before it asks whether a token can be spent. When the bucket is empty, `last_refill` points to the start of the current unfinished interval. Subtracting the elapsed part from `refill_every` gives the remaining wait. Because `refill` has already credited every complete interval, the elapsed part in this rejection branch is shorter than one interval.

Notice that the caller cannot alter `available` directly. The `&mut self` method is the one place where spending a token and reporting the result happen together. Our struct keeps its own rule: `available` stays between zero and capacity.

### Check a refill without sleeping

Replace `src/main.rs` with this version:

```rust
use std::time::{Duration, Instant};
use token_bucket_limiter::{RateLimitConfig, TokenBucket};

fn main() {
    let start = Instant::now();
    let config =
        RateLimitConfig::new(3, Duration::from_secs(2)).expect("valid rate limit configuration");
    let mut bucket = TokenBucket::new(config, start);

    for request in 1..=4 {
        let decision = bucket.try_acquire(start);
        println!(
            "request {request}: allowed={}, remaining={}, retry_after={:?}",
            decision.allowed, decision.remaining, decision.retry_after
        );
    }

    let halfway = bucket.try_acquire(start + Duration::from_secs(1));
    println!(
        "after 1s: allowed={}, retry_after={:?}",
        halfway.allowed, halfway.retry_after
    );

    let refilled = bucket.try_acquire(start + Duration::from_secs(2));
    println!(
        "after 2s: allowed={}, remaining={}",
        refilled.allowed, refilled.remaining
    );
}
```

Run `cargo run`. The program supplies instants representing one and two seconds after `start`; it does not wait in real time. That is why this check is immediate and repeatable.

```text
request 1: allowed=true, remaining=2, retry_after=None
request 2: allowed=true, remaining=1, retry_after=None
request 3: allowed=true, remaining=0, retry_after=None
request 4: allowed=false, remaining=0, retry_after=Some(2s)
after 1s: allowed=false, retry_after=Some(1s)
after 2s: allowed=true, remaining=0
```

The first three requests spend the starting tokens. The fourth is rejected. One second later there is still no complete refill interval; two seconds later one token has returned and the request spends it.

### Test the boundaries

We want to check more than the happy path. Add the `#[cfg(test)]` module shown in the complete `src/lib.rs` below, then run:

```bash
cargo test
```

The tests check that invalid settings are rejected, a burst stops at capacity, partial time is preserved, a long idle period cannot overfill the bucket, time spent while full is discarded, and an earlier timestamp never refills it. These cases matter because each one exercises a state change in the struct. The tests supply `Instant` values directly, so they finish without sleeping.

In particular, predict this case before reading its assertion: a capacity-one bucket starts full; we wait one second, spend its token, then ask again one second later. With a two-second refill interval, should that second request pass? In our design, no. The first second passed while the bucket was full, so the refill countdown starts when the token is spent.

## Complete program

Here is the finished `src/lib.rs`. It contains the configuration, decision, bucket, and boundary tests in one file:

```rust
use std::time::{Duration, Instant};

#[derive(Debug)]
pub struct RateLimitConfig {
    capacity: u32,
    refill_every: Duration,
}

impl RateLimitConfig {
    pub fn new(capacity: u32, refill_every: Duration) -> Result<Self, &'static str> {
        if capacity == 0 {
            return Err("capacity must be greater than zero");
        }
        if refill_every.is_zero() {
            return Err("refill interval must be greater than zero");
        }
        Ok(Self {
            capacity,
            refill_every,
        })
    }

    pub fn capacity(&self) -> u32 {
        self.capacity
    }

    pub fn refill_every(&self) -> Duration {
        self.refill_every
    }
}

#[derive(Debug)]
pub struct Decision {
    pub allowed: bool,
    pub remaining: u32,
    pub retry_after: Option<Duration>,
}

#[derive(Debug)]
pub struct TokenBucket {
    config: RateLimitConfig,
    available: u32,
    last_refill: Instant,
}

impl TokenBucket {
    pub fn new(config: RateLimitConfig, now: Instant) -> Self {
        let available = config.capacity;
        Self {
            config,
            available,
            last_refill: now,
        }
    }

    pub fn try_acquire(&mut self, now: Instant) -> Decision {
        self.refill(now);

        if self.available > 0 {
            self.available -= 1;
            Decision {
                allowed: true,
                remaining: self.available,
                retry_after: None,
            }
        } else {
            let elapsed = now.saturating_duration_since(self.last_refill);
            Decision {
                allowed: false,
                remaining: 0,
                retry_after: Some(self.config.refill_every - elapsed),
            }
        }
    }

    fn refill(&mut self, now: Instant) {
        if self.available == self.config.capacity {
            if now > self.last_refill {
                self.last_refill = now;
            }
            return;
        }

        let elapsed = now.saturating_duration_since(self.last_refill);
        let intervals = elapsed.as_nanos() / self.config.refill_every.as_nanos();

        if intervals == 0 {
            return;
        }

        let missing = self.config.capacity - self.available;

        if intervals >= u128::from(missing) {
            self.available = self.config.capacity;
            self.last_refill = now;
        } else {
            let added = intervals as u32;
            self.available += added;
            self.last_refill += self.config.refill_every * added;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_invalid_configuration() {
        assert!(RateLimitConfig::new(0, Duration::from_secs(1)).is_err());
        assert!(RateLimitConfig::new(2, Duration::ZERO).is_err());
    }

    #[test]
    fn allows_only_the_initial_burst() {
        let start = Instant::now();
        let config = RateLimitConfig::new(3, Duration::from_secs(2)).unwrap();
        let mut bucket = TokenBucket::new(config, start);

        assert_eq!(bucket.try_acquire(start).remaining, 2);
        assert_eq!(bucket.try_acquire(start).remaining, 1);
        assert_eq!(bucket.try_acquire(start).remaining, 0);

        let rejected = bucket.try_acquire(start);
        assert!(!rejected.allowed);
        assert_eq!(rejected.retry_after, Some(Duration::from_secs(2)));
    }

    #[test]
    fn keeps_partial_time_between_requests() {
        let start = Instant::now();
        let config = RateLimitConfig::new(1, Duration::from_secs(2)).unwrap();
        let mut bucket = TokenBucket::new(config, start);
        assert!(bucket.try_acquire(start).allowed);

        let after_one_second = bucket.try_acquire(start + Duration::from_secs(1));
        assert!(!after_one_second.allowed);
        assert_eq!(after_one_second.retry_after, Some(Duration::from_secs(1)));

        assert!(bucket.try_acquire(start + Duration::from_secs(2)).allowed);
    }

    #[test]
    fn long_idle_period_never_exceeds_capacity() {
        let start = Instant::now();
        let config = RateLimitConfig::new(2, Duration::from_secs(1)).unwrap();
        let mut bucket = TokenBucket::new(config, start);
        bucket.try_acquire(start);
        bucket.try_acquire(start);

        let later = start + Duration::from_secs(20);
        assert!(bucket.try_acquire(later).allowed);
        assert!(bucket.try_acquire(later).allowed);
        assert!(!bucket.try_acquire(later).allowed);
    }

    #[test]
    fn time_spent_full_does_not_count_toward_a_new_token() {
        let start = Instant::now();
        let config = RateLimitConfig::new(1, Duration::from_secs(2)).unwrap();
        let mut bucket = TokenBucket::new(config, start);

        assert!(bucket.try_acquire(start + Duration::from_secs(1)).allowed);
        let rejected = bucket.try_acquire(start + Duration::from_secs(2));
        assert!(!rejected.allowed);
        assert_eq!(rejected.retry_after, Some(Duration::from_secs(1)));
        assert!(bucket.try_acquire(start + Duration::from_secs(3)).allowed);
    }

    #[test]
    fn an_earlier_timestamp_does_not_refill() {
        let earlier = Instant::now();
        let start = earlier + Duration::from_secs(1);
        let config = RateLimitConfig::new(1, Duration::from_secs(2)).unwrap();
        let mut bucket = TokenBucket::new(config, start);
        assert!(bucket.try_acquire(start).allowed);

        let rejected = bucket.try_acquire(earlier);
        assert!(!rejected.allowed);
        assert_eq!(rejected.retry_after, Some(Duration::from_secs(2)));
    }
}
```

And here is the complete `src/main.rs` client:

```rust
use std::time::{Duration, Instant};
use token_bucket_limiter::{RateLimitConfig, TokenBucket};

fn main() {
    let start = Instant::now();
    let config =
        RateLimitConfig::new(3, Duration::from_secs(2)).expect("valid rate limit configuration");
    let mut bucket = TokenBucket::new(config, start);

    for request in 1..=4 {
        let decision = bucket.try_acquire(start);
        println!(
            "request {request}: allowed={}, remaining={}, retry_after={:?}",
            decision.allowed, decision.remaining, decision.retry_after
        );
    }

    let halfway = bucket.try_acquire(start + Duration::from_secs(1));
    println!(
        "after 1s: allowed={}, retry_after={:?}",
        halfway.allowed, halfway.retry_after
    );

    let refilled = bucket.try_acquire(start + Duration::from_secs(2));
    println!(
        "after 2s: allowed={}, remaining={}",
        refilled.allowed, refilled.remaining
    );
}
```

Run the finished package with:

```bash
cargo test
cargo run
```

I hope you liked it, in the next one we will learn about Rust Enums and Pattern Matching in Rust by building a process supervisor state machine. See you in the next one, till then have a great life!