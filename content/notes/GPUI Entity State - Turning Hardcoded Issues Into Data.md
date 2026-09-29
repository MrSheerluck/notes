---
title: GPUI Entity State - Turning Hardcoded Issues Into Data
type: note
description:
tags:
  - gpui
publish: true
---
So, right now all our issue is created by directly calling the `issue()` helper and that's fine for our static UI but it won't work once we start filtering issues. For that, we need a collection we cal iterate over.

Lets add this structure below the enum:
```rust
#[derive(Clone, Copy)]
struct Issue {
    id: &'static str,
    title: &'static str,
    group: &'static str,
    team: &'static str,
    assignee: &'static str,
    updated: &'static str,
    priority: &'static str,
    priority_color: u32,
    assigned_to_me: bool,
    created_by_me: bool,
    completed: bool,
}
```
Most of these fields are values we were already showing inside an issue card. We have also added four fields that we will need for interactions:

- `group` tells us where the issue should be rendered.
- `assigned_to_me` supports the assigned tab and **My issues** section.
- `created_by_me` supports the created tab and **Views** section.
- `completed` lets the user change the status of an issue.

Now, replace our unit `App` struct with this:
```rust
struct App {
    navigation: Navigation,
    active_tab: IssueTab,
    selected_issue: Option<&'static str>,
    issues: Vec<Issue>,
}
```

Then add a `new()` method where we can set the default state and add our issues:
```rust
impl App {
    fn new() -> Self {
        Self {
            navigation: Navigation::ActiveIssues,
            active_tab: IssueTab::All,
            selected_issue: None,
            issues: vec![
                Issue {
                    id: "ENG-124",
                    title: "Fix authentication redirect",
                    group: "ENGINEERING",
                    team: "Backend",
                    assignee: "John",
                    updated: "12m",
                    priority: "HIGH",
                    priority_color: 0xd95c5c,
                    assigned_to_me: true,
                    created_by_me: false,
                    completed: false,
                },
                Issue {
                    id: "ENG-123",
                    title: "Improve settings page",
                    group: "ENGINEERING",
                    team: "Frontend",
                    assignee: "Sarah",
                    updated: "1h",
                    priority: "MEDIUM",
                    priority_color: 0xd9a441,
                    assigned_to_me: false,
                    created_by_me: true,
                    completed: false,
                },
                Issue {
                    id: "ENG-122",
                    title: "Update API documentation",
                    group: "ENGINEERING",
                    team: "Documentation",
                    assignee: "Alex",
                    updated: "3h",
                    priority: "LOW",
                    priority_color: 0x5b8fd8,
                    assigned_to_me: true,
                    created_by_me: true,
                    completed: false,
                },
                Issue {
                    id: "PRO-087",
                    title: "Redesign onboarding flow",
                    group: "PRODUCT",
                    team: "Product",
                    assignee: "Maya",
                    updated: "5h",
                    priority: "MEDIUM",
                    priority_color: 0xd9a441,
                    assigned_to_me: false,
                    created_by_me: false,
                    completed: false,
                },
                Issue {
                    id: "PRO-086",
                    title: "Add keyboard shortcuts",
                    group: "PRODUCT",
                    team: "Desktop",
                    assignee: "David",
                    updated: "1d",
                    priority: "LOW",
                    priority_color: 0x5b8fd8,
                    assigned_to_me: true,
                    created_by_me: false,
                    completed: false,
                },
            ],
        }
    }
}
```

Now go to the window creation code inside `main()` and replace:

```rust
let view = cx.new(|_| App);
```

with:

```rust
let view = cx.new(|_| App::new());
```

`cx.new(...)` stores our `App` inside a GPUI `Entity<App>`. You can think of the `view` variable as a handle to that entity. GPUI keeps this state alive between renders.

GPUI Kit uses the same pattern in its own example. It creates a view using `cx.new(...)` and passes that view to `Root::new(...)` [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/kit/src/lib.rs#L98-L139) [source](https://github.com/longbridge/gpui-kit). There is also a test which creates an entity, updates its value and then reads it using the returned handle [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/kit/tests/test_macro.rs#L8-L17) [source](https://github.com/longbridge/gpui-kit).

Run the application again:

```bash
cargo run
```

The app should still look the same. We have state now but our helper functions are still rendering the old hardcoded values.