# 21. Merge Two Sorted Lists

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-11-24`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
This iterative solution uses a dummy head node to simplify the construction of the merged list. It traverses both input lists simultaneously, comparing the current nodes' values. The node with the smaller value is appended to the merged list, and its pointer is advanced. After one list is exhausted, the remaining nodes of the other list are directly appended to the end of the merged list.

## Time Complexity
**O(m + n)**
Where `m` and `n` are the lengths of `list1` and `list2` respectively. The algorithm iterates through each node of both lists exactly once, performing constant time operations per node.

## Space Complexity
**O(1)**
The solution uses a constant amount of extra space. It only creates one new `ListNode` (the dummy head) and a few pointer variables, regardless of the input list sizes. It re-uses the existing nodes from the input lists.

## Key Takeaway
The use of a **dummy head (or sentinel) node** simplifies the code considerably. It eliminates the need for special handling of the first node of the merged list and gracefully handles cases where input lists might be empty, making the logic cleaner and less error-prone.

---

Generated automatically by LeetCode AutoSync AI.
