---
title: GPUI Click Events - Making the Tabs Interactive
type: note
description:
tags:
  - gpui
publish: true
---
We can now use the same pattern for our tabs. Add another method for changing the active tab:

```rust
fn set_tab(&mut self, tab: IssueTab, cx: &mut Context<Self>) {
    self.active_tab = tab;
    self.selected_issue = None;
    cx.notify();
}
```

Then replace the old `tab()` function with:

```rust
fn tab(
    &self,
    label: &'static str,
    tab: IssueTab,
    cx: &Context<Self>,
) -> impl IntoElement {
let active = self.active_tab == tab;

div()
    .id(format!("issue-tab-{label}"))
    .h_full()
    .flex()
    .items_center()
    .cursor_pointer()
    .text_size(px(12.0))
    .text_color(if active {
        rgb(0xe2e3e6)
    } else {
        rgb(0x696d75)
    })
    .when(active, |this| {
        this.border_b_2().border_color(rgb(0x7c6ff2))
    })
    .on_click(cx.listener(move |this, _, _, cx| {
        this.set_tab(tab, cx);
    }))
    .child(label)
}
```

Update the three tab calls inside `main_content()`:

```rust
.child(self.tab("All", IssueTab::All, cx))
.child(self.tab(
    "Assigned to me",
    IssueTab::AssignedToMe,
    cx,
))
.child(self.tab(
    "Created by me",
    IssueTab::CreatedByMe,
    cx,
))
```

Run the application:

```bash
cargo run
```

![[__support/gpui/issue-filter-tabs-demo.mov]]

The purple underline should now move to the clicked tab and the issue list should update immediately. GPUI Kit uses the same selected state pattern in its settings pages. The active style comes from the current selection and clicking an item changes that selection before calling `cx.notify()` [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/component/src/setting/settings.rs#L188-L236) [[GPUI]]

Try combining the sidebar and tab filters. For example:

1. Select **My issues**.
2. Select **Created by me**.

Only `ENG-122` should remain because it is assigned to the current user and was also created by the current user. Both filters are being applied to the same issue collection.
