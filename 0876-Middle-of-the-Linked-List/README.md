# 876. Middle of the Linked List

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-11-25`  

---

## Solution

See `Solution.java`

---

## AI Explanation

Here's an analysis of the provided LeetCode solution:

## Approach
This solution employs the classic "fast and slow pointer" (also known as Floyd's Tortoise and Hare) algorithm. Two pointers, `slow` and `fast`, are initialized at the head of the list. In each iteration, `slow` moves one step forward, while `fast` moves two steps forward. When the `fast` pointer reaches the end of the list (or `fast.next` is null), the `slow` pointer will be exactly at the middle node.

## Time Complexity
**O(N)**, where N is the number of nodes in the linked list. The `fast` pointer traverses the list at most once (approximately N/2 steps), and the `slow` pointer traverses half the list. Each step involves constant time operations.

## Space Complexity
**O(1)**. The solution uses a constant amount of extra space regardless of the list size, as it only requires two pointers (`slow` and `fast`) to navigate the list.

## Key Takeaway
This solution effectively demonstrates the "fast and slow pointer" technique, which is a crucial pattern for many linked list problems. It efficiently handles both odd and even length lists to find the second middle node (as required by the problem for even-length lists) without needing to count the total number of nodes beforehand, making it an optimal approach.

---

Generated automatically by LeetCode AutoSync AI.
