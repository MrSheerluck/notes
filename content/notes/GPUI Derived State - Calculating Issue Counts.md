---
title: GPUI Derived State - Calculating Issue Counts
type: note
description:
tags:
  - gpui
publish: true
---
Our sidebar counts and footer are still hardcoded. If we keep them like this, they will become incorrect as soon as an issue changes. We should calculate them from the same issue state instead.

Add these methods:

```rust
fn active_count(&self) -> usize {
    self.issues
        .iter()
        .filter(|issue| !issue.completed)
        .count()
}

fn assigned_count(&self) -> usize {
    self.issues
        .iter()
        .filter(|issue| {
            issue.assigned_to_me && !issue.completed
        })
        .count()
}
```

Pass them to the matching sidebar items:

```rust
.child(self.sidebar_item(
    IconName::Inbox,
    "Inbox",
    Some(self.active_count()),
    Navigation::Inbox,
    cx,
))
.child(self.sidebar_item(
    IconName::User,
    "My issues",
    Some(self.assigned_count()),
    Navigation::MyIssues,
    cx,
))
```

At the beginning of `main_content()`, save the number of visible issues before we move the vectors into their group elements:

```rust
let visible_count = visible.len();
```

Replace the hardcoded footer with:

```rust
.child(
    div()
        .pt(px(12.0))
        .text_size(px(11.0))
        .text_color(rgb(0x555960))
        .child(format!(
            "Showing {visible_count} of {} issues",
            self.issues.len(),
        )),
)
```

Run the project:

```bash
cargo run
```

![[__support/gpui/live-issue-counts-demo.mov]]

Complete an issue and look at the sidebar and footer counts. They should update automatically. You can also switch between tabs and check that the footer always matches the number of visible cards.

This is why rendering from state is useful. We don’t need to manually update three different labels. We change the issue once, call `cx.notify()` and every count is calculated again from the new state.

GPUI Kit’s list component also derives collection information while rendering. It reads the total number of items from its row cache and uses that value for every rendered list item [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/component/src/list/list.rs#L459-L484) [[GPUI]]

