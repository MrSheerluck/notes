---
title: GPUI Selection State - Selecting an Issue
type: note
description:
tags:
  - gpui
publish: true
---
GPUI Selection State - Selecting an Issue

Now, let’s make our issue cards selectable. Add this handler:

```rust
fn select_issue(
    &mut self,
    id: &'static str,
    cx: &mut Context<Self>,
) {
    self.selected_issue = Some(id);
    cx.notify();
}
```

At the beginning of `issue_card()`, check whether this card is selected:

```rust
let selected = self.selected_issue == Some(issue.id);
let card_id = issue.id;
```

Add an ID, pointer cursor and click listener to the outer card element:

```rust
.id(format!("issue-card-{}", issue.id))
.cursor_pointer()
.on_click(cx.listener(move |this, _, _, cx| {
    this.select_issue(card_id, cx);
}))
```

Now change the fixed border and background colours so they depend on `selected`:

```rust
.border_color(if selected {
    rgb(0x7c6ff2)
} else {
    rgb(0x202227)
})
.bg(if selected {
    rgb(0x1c1d28)
} else {
    rgb(0x141619)
})
```

Run the application:

```bash
cargo run
```

Click a few different issue cards. The selected card should have a purple border and a slightly lighter background. If you change the navigation section or tab, the selection will be cleared because both handlers set `selected_issue` back to `None`.

GPUI Kit’s tree component also keeps selection as an optional index. While rendering, it compares every row index with that selected value and uses a listener to change the selection when a row is clicked [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/base/src/tree.rs#L181-L247) [[GPUI]]
