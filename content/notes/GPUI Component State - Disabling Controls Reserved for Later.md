---
title: GPUI Component State - Disabling Controls Reserved for Later
type: note
description:
tags:
  - gpui
publish: true
---
The header still has Filter, Sort, New issue and overflow buttons from the first article. We are not implementing those features in this article, so these buttons should not look like they are working.

Add `Disableable` to the component imports at the top of the file. GPUI Kit defines this trait for components which can have a disabled state [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/base/src/component_traits.rs#L1-L20), and `Button` implements this trait [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/component/src/button/button.rs#L465-L470) [[GPUI]]

```rust
use gpui_kit::component::{
    Disableable, Icon, IconName, Root, Sizable,
    button::{Button, ButtonVariants},
};
```

Now add `.disabled(true)` to the buttons we are not using. For example:

```rust
Button::new("filter")
    .ghost()
    .label("Filter")
    .small()
    .disabled(true)
```

Do the same for `sort`, `new` and `more`. We can keep the same design from the first article without making these buttons look usable.

Run the application:

```bash
cargo run
```

These four buttons should now look disabled while the sidebar items, tabs, issue cards and status circles will remain interactive.
