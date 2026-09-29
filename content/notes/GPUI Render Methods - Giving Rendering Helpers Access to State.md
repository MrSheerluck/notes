---
title: GPUI Render Methods - Giving Rendering Helpers Access to State
type: note
description:
tags:
  - gpui
publish: true
---
Our `sidebar()` and `main_content()` helpers are just functions right now, which means they cannot read `self.navigation`, `self.active_tab` or `self.issues`.

Move the following functions into the existing `impl App` block and turn them into methods:
```rust
fn sidebar(&self, cx: &Context<Self>) -> impl IntoElement
fn sidebar_item(
    &self,
    icon: IconName,
    label: &'static str,
    count: Option<&'static str>,
    active: bool,
) -> impl IntoElement
fn main_content(&self, cx: &Context<Self>) -> impl IntoElement
fn tab(
    &self,
    label: &'static str,
    active: bool,
) -> impl IntoElement
```
You don’t need to change the body of these functions yet. The new `self` and `cx` parameters may remain unused for a short time and that is fine. We are only moving these functions into the object which now owns our state.

Update the root render method:
```rust
impl Render for App {
    fn render(
        &mut self,
        _window: &mut Window,
        cx: &mut Context<Self>,
    ) -> impl IntoElement {
        div()
            .size_full()
            .bg(rgb(0x0f1012))
            .text_color(rgb(0xe8e9ea))
            .child(
                div()
                    .size_full()
                    .flex()
                    .flex_row()
                    .child(self.sidebar(cx))
                    .child(self.main_content(cx)),
            )
    }
}
```
You can see that `_cx` has now become `cx`. In the first article we used the underscore because we were not using this parameter. We need it now, so we can finally remove that underscore.

Wherever these methods call each other, add `self` and pass `cx`. For example:
```rust
.child(self.sidebar_item(
    IconName::Inbox,
    "Inbox",
    Some("3"),
    false,
))
```
and:

```rust
.child(self.tab("All", true))
```

Run the application now:

```bash
cargo run
```

The interface should render normally. We haven’t added any visible behaviour yet but our rendering helpers can now read the application state and create event listeners for the same `App` entity.

You can find a similar pattern in GPUI Kit’s settings component. Its rendering methods read the selected state, create children from a collection and use the context to attach listeners [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/component/src/setting/settings.rs#L188-L236) [[GPUI]].
