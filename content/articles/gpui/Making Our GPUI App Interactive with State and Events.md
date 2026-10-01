---
title: Make a GPUI App Interactive - States and Events in GPUI
type: article
description: We continue building our Linear-like desktop app with GPUI Kit by adding navigation, filtering, issue selection, completion and live UI updates while learning how GPUI state, event listeners and cx.notify() work.
tags:
  - gpui
publish: true
order: 2
aliases:
  - "articles/Making Our GPUI App Interactive with State and Events"
previous: "[[Building Your First Desktop UI with GPUI]]"
---
Hi, in the previous article we built a Linear-like issue tracker interface using GPUI Kit. We learned how to create layouts, split the UI into small helper functions and style everything using flexbox, spacing, colours and borders.

It looked like an application but it was still completely static.

In this article, we will continue with that same project and make it interactive.

![Youtube Video](https://youtu.be/bs8bpAZ10SM)

![[__support/gpui/interactive-issue-tracker-demo.mov]]
By the end, users will be able to:

- Navigate between sidebar sections.
- Filter issues using the **All**, **Assigned to me**, and **Created by me** tabs.
- Select an issue card.
- Mark an issue as completed or restore it.
- See issue counts update automatically.
- See an empty state when no issues match the current filters.

While building these features, we will learn how GPUI stores view state, how event handlers access that state, and why `cx.notify()` is needed after a state change.

> This article starts from the final code in [Your First GPUI App — Building a Desktop UI in Rust](https://blog.sheerluck.dev/posts/your-first-gpui-app-building-a-desktop-ui-in-rust/). You can also get the starting project from [the GitHub repository](https://github.com/MrSheerluck/gpui-linear-ui-clone).

Source code: [click here](https://github.com/MrSheerluck/gpui-linear-ui-clone/tree/part-2)

> From now on, we will use a separate branch for each of the article so that you can follow all the articles and code along. So use part-2 branch for this article


## Prerequisites

Before continuing, you should:

- Be comfortable with basic Rust structs, enums, vectors, and iterators.
- Have completed the first article or downloaded its final project.
- Be able to run the existing application with `cargo run`.

No additional dependencies are required. We will continue using `gpui-kit`, `rust-embed`, and `anyhow` from the first article.

![[GPUI View State - Starting from the Existing Interface]]


![[GPUI View State - Modelling Navigation and Tabs with Enums]]

![[GPUI Entity State - Turning Hardcoded Issues Into Data]]

![[GPUI Render Methods - Giving Rendering Helpers Access to State]]

![[GPUI Event Listeners - Handling Sidebar Clicks]]

![[GPUI Dynamic Rendering - Filtering the Issue Collection]]

![[GPUI Click Events - Making the Tabs Interactive]]

![[GPUI Selection State - Selecting an Issue]]

![[GPUI Mutable State - Completing and Restoring Issues]]

![[GPUI Derived State - Calculating Issue Counts]]

![[GPUI Conditional Rendering - Displaying an Empty State]]

![[GPUI Component State - Disabling Controls Reserved for Later]]

![[GPUI State Login - Testing Filters Without Opening a Window]]


I hope you learned something new about GPUI. I know we are going slow but I would like to keep it this way so that we can learn it slowly and steadily.

In the next one we will learn how to break our app into smaller pieces and make it modular. Till then, have a great life