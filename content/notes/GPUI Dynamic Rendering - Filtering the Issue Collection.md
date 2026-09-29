---
title: GPUI Dynamic Rendering - Filtering the Issue Collection
type: note
description:
tags:
  - gpui
publish: true
---
Our sidebar changes the current navigation now but every page still shows the same issues. So, before making the tabs clickable, we need a function which calculates the issues we should show.

Add this method to `impl App`:
```rust
fn visible_issues(&self) -> Vec<Issue> {
    self.issues
        .iter()
        .copied()
        .filter(|issue| match self.navigation {
            Navigation::Inbox | Navigation::ActiveIssues => {
                !issue.completed
            }
            Navigation::MyIssues => issue.assigned_to_me,
            Navigation::Projects => true,
            Navigation::Views => issue.created_by_me,
        })
        .filter(|issue| match self.active_tab {
            IssueTab::All => true,
            IssueTab::AssignedToMe => issue.assigned_to_me,
            IssueTab::CreatedByMe => issue.created_by_me,
        })
        .collect()
}
```
We are using two filters because the sidebar and the tab both affect our result. An issue must pass both conditions before we display it.

For `Projects`, we are returning every issue including the completed ones. Later, this will give us a place where we can find and restore a completed issue.

Now add a helper which renders a group from a vector:
```rust
fn issue_group(
    &self,
    name: &'static str,
    issues: Vec<Issue>,
    cx: &Context<Self>,
) -> impl IntoElement {
    div()
        .flex()
        .flex_col()
        .gap(px(1.0))
        .child(group_header(name, issues.len()))
        .children(
            issues
                .into_iter()
                .map(|issue| self.issue_card(issue, cx)),
        )
}
```
Our old `group_header()` accepted a `u32`. Change the count parameter to `usize` so we can pass `issues.len()` directly:

```rust
fn group_header(
    name: &'static str,
    count: usize,
) -> impl IntoElement {
    // Keep the existing element body.
}
```

The `.children()` method takes an iterator and adds every generated element to the parent. In the first article we added five issue cards manually. Now the number of cards can change while the app is running. GPUI Kit’s list component uses the same pattern to give every row an ID, check its selected state, attach a listener and render its children [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/component/src/list/list.rs#L470-L505) [source](https://github.com/longbridge/gpui-kit).

Rename our old `issue()` helper to `issue_card()` and change its parameters to:

```rust
fn issue_card(
    &self,
    issue: Issue,
    cx: &Context<Self>,
) -> impl IntoElement
```

Inside the existing styling code, replace the individual parameters with the matching fields from `issue`:

```rust
issue.id
issue.title
issue.team
issue.assignee
issue.updated
issue.priority
issue.priority_color
```

At the beginning of `main_content()`, get the visible issues and split them into groups:

```rust
let visible = self.visible_issues();

let engineering = visible
    .iter()
    .copied()
    .filter(|issue| issue.group == "ENGINEERING")
    .collect::<Vec<_>>();

let product = visible
    .iter()
    .copied()
    .filter(|issue| issue.group == "PRODUCT")
    .collect::<Vec<_>>();
```

Now remove the hardcoded Engineering and Product issue blocks and replace them with:

```rust
.when(!engineering.is_empty(), |this| {
    this.child(self.issue_group(
        "ENGINEERING",
        engineering,
        cx,
    ))
})
.when(!product.is_empty(), |this| {
    this.child(
        div()
            .mt(px(12.0))
            .child(self.issue_group("PRODUCT", product, cx)),
    )
})
```

Run the project:

```bash
cargo run
```

![[__support/gpui/sidebar-issue-filtering-demo.mov]]

The default **Active issues** page should still show all five issues. If you click **My issues**, you should only see the three issues where `assigned_to_me` is `true`. Click **Views** and you should see the two issues created by the current user.

Our tabs still don’t work but the sidebar is now filtering actual issue data.