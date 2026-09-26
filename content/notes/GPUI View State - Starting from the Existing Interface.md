---
title: GPUI View State - Starting from the Existing Interface
type: note
description:
tags:
  - gpui
publish: true
---
Let's open our project from the [[Building Your First Desktop UI with GPUI]] and you can see that our application view looks like this:
```rust
struct App;
```
This is a unit struct and it doesn't store any data. So, our app has no way to remember which sidebar item we selected, which tab s active or whether an issue is completed

You can also see the same thing in our rendering code:
```rust
.child(sidebar_item(
    IconName::CircleX,
    "Active issues",
    None,
    true,
))
```
That final trye means **Active issues** will always look selected. 

Our tabs are also hardcoded in the same way:
```rust
.child(tab("All", true))
.child(tab("Assigned to me", false))
.child(tab("Created by me", false))
```
To make them interactive, we need to keep these values in our application state and then render the UI using that state.

Before changing anything, run the current project once:
```bash
cargo run
```
Try clicking the navigation items, tabs, issue cards and status circles. Nothing will change, which is exactly what we are going to fix now.

GPUI Kit’s asset example is also a simple stateless view. Its `Example` struct has no fields and its `render()` method always returns the same element tree [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/examples/app_assets/src/main.rs#L31-L57) [[GPUI]].
