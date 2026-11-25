# 142. Linked List Cycle II

**Difficulty:** `Medium`  
**Language:** `Java`  
**Date Solved:** `2026-11-25`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
This solution employs Floyd's Cycle-Finding Algorithm (tortoise and hare) to first detect if a cycle exists in the linked list. If a cycle is found, the meeting point of the slow and fast pointers is used to calculate the exact length of the cycle. Finally, two new pointers are initialized at the head, with one advanced by the cycle's length, and then both move step-by-step until they meet, which marks the start of the cycle.

## Time Complexity
**O(N)**, where N is the total number of nodes in the linked list.
The slow and fast pointers traverse the list at most twice to detect the cycle and find its length. Then, the two new pointers also traverse the list at most twice to find the cycle's starting node. Each step contributes linearly to the total traversal.

## Space Complexity
**O(1)**
The solution uses a constant number of pointers (`s`, `f`, `first`, `second`, `current`) regardless of the input list's size, requiring no auxiliary data structures.

## Key Takeaway
This solution demonstrates a classic three-step approach for "Linked List Cycle II": 1) detect the cycle, 2) calculate its length, and 3) use the length to find the cycle's start. This is a powerful application of the two-pointer technique and is a standard interview question pattern.

---

Generated automatically by LeetCode AutoSync AI.
