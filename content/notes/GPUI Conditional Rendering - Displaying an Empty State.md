---
title: GPUI Conditional Rendering - Displaying an Empty State
type: note
description:
tags:
  - gpui
publish: true
---
Some sidebar and tab combinations may return no issues. If we render a blank area, it may look like something is broken, so let’s add a small empty state.

Add this free helper function outside `impl App`:

```rust
fn empty_state() -> impl IntoElement {
    div()
        .h(px(170.0))
        .w_full()
        .flex()
        .flex_col()
        .items_center()
        .justify_center()
        .rounded(px(8.0))
        .border_1()
        .border_color(rgb(0x272a2f))
        .bg(rgb(0x131416))
        .child(
            div()
                .text_size(px(14.0))
                .font_weight(FontWeight::MEDIUM)
                .child("No issues found"),
        )
        .child(
            div()
                .mt(px(6.0))
                .text_size(px(11.0))
                .text_color(rgb(0x696d75))
                .child("Try another tab or navigation item."),
        )
}
```

After the issue groups inside `main_content()`, add it conditionally:

```rust
.when(visible.is_empty(), |this| {
    this.child(empty_state())
})
```

Run the application and choose a combination which has no matching issues. You should now see our empty state instead of a blank page.

GPUI Kit’s dock follows the same conditional rendering idea. It renders the active panel when one exists and asks the renderer for an empty element when there is no active panel [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/base/src/dock/tab_group.rs#L751-L759) [[GPUI]]

