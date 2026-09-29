---
title: GPUI Event Listeners - Handling Sidebar Clicks
type: note
description:
tags:
  - gpui
publish: true
---
Now we can make our first part interactive. Add this method inside `impl App`:
```rust
fn set_navigation(
    &mut self,
    navigation: Navigation,
    cx: &mut Context<Self>,
) {
    self.navigation = navigation;
    self.selected_issue = None;
    cx.notify();
}
```
First, we are changing our navigation rust state and after that `cx.notify()` tells GPUI to render this entity again. GPUI Kit's tree state uses the same pattern where it changes the selected value and then calls `cx.notify()` [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/base/src/tree.rs#L212-L238) [[GPUI]]

If we don’t call `cx.notify()`, the value will change in memory but our interface may continue showing the old state.

Now replace the signature and body of `sidebar_item()` with this version:
```rust
fn sidebar_item(
    &self,
    icon: IconName,
    label: &'static str,
    count: Option<usize>,
    navigation: Navigation,
    cx: &Context<Self>,
) -> impl IntoElement {
let active = self.navigation == navigation;

div()
    .id(format!("sidebar-item-{label}"))
    .h(px(31.0))
    .flex()
    .items_center()
    .px(px(8.0))
    .rounded(px(6.0))
    .cursor_pointer()
    .when(active, |this| this.bg(rgb(0x202227)))
    .hover(|this| this.bg(rgb(0x1d2024)))
    .on_click(cx.listener(move |this, _, _, cx| {
        this.set_navigation(navigation, cx);
    }))
    .child(
        Icon::new(icon)
            .size(px(14.0))
            .text_color(if active {
                rgb(0xd9dbe0)
            } else {
                rgb(0x777b83)
            }),
    )
    .child(
        div()
            .ml(px(9.0))
            .flex_1()
            .text_size(px(12.0))
            .text_color(if active {
                rgb(0xe0e1e4)
            } else {
                rgb(0x858990)
            })
            .child(label),
    )
    .when_some(count, |this, count| {
        this.child(
            div()
                .text_size(px(10.0))
                .text_color(rgb(0x656970))
                .child(count.to_string()),
        )
    })
}
```
An interactive GPUI element needs an ID, so we are creating one using its label:

```rust
.id(format!("sidebar-item-{label}"))
```

Now look at the listener:

```rust
.on_click(cx.listener(move |this, _, _, cx| {
    this.set_navigation(navigation, cx);
}))
```

The callback used by `.on_click()` normally receives the click event, window and application context. `cx.listener(...)` connects that callback to our current entity and gives us `&mut App` as `this`. This is how our click handler gets mutable access to the view state. GPUI Kit’s tree rows also combine an element ID with `cx.listener(...)`, update the selected item and notify the view [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/base/src/tree.rs#L420-L445) [[GPUI]]

Update all five calls inside `sidebar()` and pass the matching `Navigation` value to each item. We can keep the count values fixed for now.

We should also make the header and page heading use our state. Replace the hardcoded `"Active"` and `"Active issues"` values with:

```rust
.child(self.navigation.title())
```

And replace the hardcoded subtitle with:

```rust
.child(self.navigation.subtitle())
```

Run the application:

```bash
cargo run
```

Click every sidebar item. The highlight, breadcrumb, page title and description should now change together. This is our first complete state and event flow:

```text
click -> set_navigation() -> cx.notify() -> render()
```

![[__support/gpui/sidebar-navigation-demo.mov]]