---
title: GPUI View State - Modelling Navigation and Tabs with Enums
type: note
description:
tags:
  - gpui
publish: true
---
We can store the active navigation item as a string but an enum works better here. It makes sure the value can only be one of the sections supported by our app

Lets add these enums above `struct App`:
```rust
#[derive(Clone, Copy, PartialEq, Eq)]
enum Navigation {
    Inbox,
    MyIssues,
    ActiveIssues,
    Projects,
    Views,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum IssueTab {
    All,
    AssignedToMe,
    CreatedByMe,
}
```
We are deriving `PartialEq` and `Eq` because later we will compare the current value with every navigation item or tab. `Clone` and `Copy` will let us move these small enum values into click handlers without losing them from our application state.

One more thing, each navigation item also needs its own title and description, so add these two methods:
```rust
impl Navigation {
    fn title(self) -> &'static str {
        match self {
            Self::Inbox => "Inbox",
            Self::MyIssues => "My issues",
            Self::ActiveIssues => "Active issues",
            Self::Projects => "Projects",
            Self::Views => "Views",
        }
    }

    fn subtitle(self) -> &'static str {
        match self {
            Self::Inbox => "Recently updated issues",
            Self::MyIssues => "Issues currently assigned to you",
            Self::ActiveIssues => "Issues currently being worked on",
            Self::Projects => "Issues across every project",
            Self::Views => "Issues included in your saved view",
        }
    }
}
```

Now, lets run the project:
```bash
cargo run
```
The interface should look exactly the same. We have only described the possible values for now, we are not storing or using them yet.

GPUI Kit’s system monitor uses the same idea for its tabs. It represents the available tabs using a `MonitorTab` enum and later matches that enum while rendering the selected content [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/examples/system_monitor/src/main.rs#L24-L40) [[GPUI]]

