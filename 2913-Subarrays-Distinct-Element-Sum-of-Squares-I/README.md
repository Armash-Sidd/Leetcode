# 2913. Subarrays Distinct Element Sum of Squares I

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-10-15`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution employs a nested loop structure to iterate through all possible subarrays. For each subarray, it dynamically maintains a `HashSet` to keep track of the distinct elements encountered. The square of the current subarray's distinct element count is then calculated and added to the overall sum.

## Time Complexity
**O(n^2)**.
The outer loop runs `n` times. The inner loop also runs up to `n` times for each iteration of the outer loop. Inside the inner loop, `HashSet` operations like `add()` and `size()` take average O(1) time. Therefore, the total time complexity is dominated by the `n * n` iterations, resulting in O(n^2).

## Space Complexity
**O(n)**.
A `HashSet` is used to store the distinct elements of the current subarray. In the worst case, a subarray can contain up to `n` distinct elements, requiring the `HashSet` to store `n` integers. This leads to a linear space complexity.

## Key Takeaway
For problems requiring the count of distinct elements within every possible subarray, using a `HashSet` (or a similar hash-based data structure) within a nested loop allows for efficient O(1) average-case updates and lookups for distinctness, making it a standard and effective pattern for such computations.

---

Generated automatically by LeetCode AutoSync AI.
