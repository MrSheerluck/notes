---
title: GPUI State Login - Testing Filters Without Opening a Window
type: note
description:
tags:
  - gpui
publish: true
---
Most of our application is visual but the filtering logic is just normal Rust. We can test it without opening a GPUI window.

Add these tests at the bottom of `main.rs`:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_view_shows_every_active_issue() {
        let app = App::new();
        assert_eq!(app.visible_issues().len(), 5);
    }

    #[test]
    fn assigned_tab_filters_the_issue_collection() {
        let mut app = App::new();
        app.active_tab = IssueTab::AssignedToMe;
        assert_eq!(app.visible_issues().len(), 3);
    }

    #[test]
    fn completed_issues_leave_the_active_view_but_remain_in_projects() {
        let mut app = App::new();
        app.issues[0].completed = true;

        assert_eq!(app.visible_issues().len(), 4);

        app.navigation = Navigation::Projects;
        assert_eq!(app.visible_issues().len(), 5);
    }

    #[test]
    fn navigation_and_tabs_are_combined() {
        let mut app = App::new();
        app.navigation = Navigation::MyIssues;
        app.active_tab = IssueTab::CreatedByMe;

        let issues = app.visible_issues();
        assert_eq!(issues.len(), 1);
        assert_eq!(issues[0].id, "ENG-122");
    }
}
```

Run them with:

```bash
cargo test
```

You should see:

```text
test result: ok. 4 passed; 0 failed
```

Once the tests pass, launch the application one final time:

```bash
cargo run
```

Now check the complete interaction flow:

1. Click every sidebar item and watch the heading change.
2. Switch between all three tabs.
3. Select several issue cards.
4. Complete an issue from **Active issues**.
5. Open **Projects** and restore it.
6. Confirm that all visible counts update.
7. Produce a filter with no results and check the empty state.

GPUI Kit tests component state without launching a normal application window as well. Its button tests construct buttons, resolve their selected and disabled styles and assert the result directly [in](https://github.com/longbridge/gpui-kit/blob/v0.6.0/crates/base/src/button.rs#L446-L488) [source](https://github.com/longbridge/gpui-kit).