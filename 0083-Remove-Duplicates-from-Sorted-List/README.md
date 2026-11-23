# 83. Remove Duplicates from Sorted List

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-11-23`  

---

## Solution

See `Solution.java`

---

## AI Explanation

This Java solution efficiently removes duplicates from a sorted singly-linked list using an in-place approach.

## Approach
This solution uses a single pointer, `temp`, to traverse the linked list. It compares the current node's value (`temp.val`) with the next node's value (`temp.next.val`). If they are identical (a duplicate is found), the next node is effectively removed by updating `temp.next` to point to `temp.next.next`, thus skipping the duplicate. The `temp` pointer only advances to the next node when no duplicate is found, ensuring all consecutive duplicates of the current `temp.val` are handled.

## Time Complexity
**O(N)**. The single `temp` pointer iterates through the list from head to tail. Each node is visited at most a constant number of times (once by `temp` advancing, and potentially revisited by `temp.next` when checking for duplicates). In the worst case, `temp` moves N times.

## Space Complexity
**O(1)**. The solution uses only a few extra pointers (`temp`) which consume a constant amount of memory, regardless of the input list's size. All modifications are performed in-place.

## Key Takeaway
While the solution correctly handles duplicates in a non-empty list, it **does not handle the edge case of an empty list** (`head == null`). If `head` is `null`, `ListNode temp = head;` makes `temp` also `null`, and the subsequent `temp.next` access within the `while` condition will result in a `NullPointerException`. It's crucial to always validate input for edge cases like empty lists or single-node lists at the beginning of the function.

---

Generated automatically by LeetCode AutoSync AI.
