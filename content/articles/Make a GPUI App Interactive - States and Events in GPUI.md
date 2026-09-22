---
title: "Make a GPUI App Interactive - States and Events in GPUI"
type: article
description:
tags: []
publish: false
---

In the previous article, we built a Linear-inspired issue tracker interface using GPUI. We learned how GPUI renders an element tree, how to compose an interface from helper functions, and how to style it using flexbox, spacing, colours, borders, and conditional styles.

The result looked like an application, but it was still only a picture of one. The active sidebar item was hardcoded, the selected tab never changed, and clicking an issue did nothing.

In this article, we will continue with that same project and make it interactive.
![[Screen Recording 2026-09-08 at 09.38.52.mov]]
By the end, users will be able to:

- Navigate between sidebar sections.
- Filter issues using the **All**, **Assigned to me**, and **Created by me** tabs.
- Select an issue card.
- Mark an issue as completed or restore it.
- See issue counts update automatically.
- See an empty state when no issues match the current filters.

While building these features, we will learn how GPUI stores view state, how event handlers access that state, and why `cx.notify()` is needed after a state change.

> This article starts from the final code in [Your First GPUI App — Building a Desktop UI in Rust](https://blog.sheerluck.dev/posts/your-first-gpui-app-building-a-desktop-ui-in-rust/). You can also get the starting project from [the GitHub repository](https://github.com/MrSheerluck/gpui-linear-ui-clone).

## Prerequisites

Before continuing, you should:

- Be comfortable with basic Rust structs, enums, vectors, and iterators.
- Have completed the first article or downloaded its final project.
- Be able to run the existing application with `cargo run`.

No additional dependencies are required. We will continue using `gpui-kit`, `rust-embed`, and `anyhow` from the first article.
