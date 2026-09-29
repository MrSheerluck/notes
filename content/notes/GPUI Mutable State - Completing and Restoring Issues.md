---
title: GPUI Mutable State - Completing and Restoring Issues
type: note
description:
tags:
  - gpui
publish: true
---
Selecting an issue only changes `selected_issue`. To complete an issue, we need to change one of the items inside `Vec<Issue>`.

Add this method:

```rust
fn toggle_issue(
    &mut self,
    id: &'static str,
    cx: &mut Context<Self>,
) {
    if let Some(issue) = self
        .issues
        .iter_mut()
        .find(|issue| issue.id == id)
    {
        issue.completed = !issue.completed;
    }

    cx.notify();
}
```

We are using `iter_mut()` because reading the matching issue is not enough here. We need a mutable reference so that we can change `completed`.

At the beginning of `issue_card()`, save the issue ID for the status handler:

```rust
let status_id = issue.id;
```

Now replace the old empty status circle with this:

```rust
div()
    .id(format!("issue-status-{}", issue.id))
    .size(px(18.0))
    .rounded_full()
    .border_2()
    .border_color(if issue.completed {
        rgb(0x4e9f7a)
    } else {
        rgb(issue.priority_color)
    })
    .when(issue.completed, |this| {
        this.bg(rgb(0x4e9f7a))
    })
    .mr(px(11.0))
    .flex()
    .items_center()
    .justify_center()
    .text_size(px(11.0))
    .text_color(rgb(0x101113))
    .cursor_pointer()
    .on_click(cx.listener(move |this, _, _, cx| {
        cx.stop_propagation();
        this.toggle_issue(status_id, cx);
    }))
    .when(issue.completed, |this| this.child("✓"))
```

Our status circle is inside a clickable issue card. A click can move from the child to its parent, so clicking the status circle would also select the complete card if we didn’t stop it.

This line stops the click after our status handler has processed it:

```rust
cx.stop_propagation();
```

GPUI Kit does the same thing for nested attachment actions. It stops the event so an inner control does not also activate the clickable element around it [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/component/src/attachment.rs#L654-L671) [[GPUI]].

We should also make a completed issue look different. Add this to the element which displays `issue.title`:

```rust
.when(issue.completed, |this| {
    this.line_through().text_color(rgb(0x656970))
})
```

Run the application:

```bash
cargo run
```

![[__support/gpui/issue-completion-and-restoration-demo.mov]]

Click a status circle on the **Active issues** page. That issue should disappear because this page only shows incomplete issues.

Next:

1. Open **Projects** from the sidebar.
2. Find the completed issue.
3. Click its green status circle.

The checkmark and strikethrough should disappear. Go back to **Active issues** and you should see the restored issue again.