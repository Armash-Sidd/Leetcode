# 3550. Smallest Index With Digit Sum Equal to Index

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-09-24`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution iterates through each index `i` of the input array `nums` starting from `0`. For each element `nums[i]`, it calculates the sum of its digits. If this calculated sum of digits equals the current index `i`, the function immediately returns `i` as it has found the smallest such index. If the loop completes without finding any such index, it returns -1.

## Time Complexity
**O(N * D)**
Where `N` is the length of the `nums` array and `D` is the maximum number of digits any number in `nums` can have. The main loop runs `N` times. Inside the loop, the `count` function is called, which takes `O(D)` time in the worst case (number of digits in `nums[i]`). For standard integer types, `D` is a small constant (e.g., at most 10 for `int` values up to $2 \times 10^9$).

## Space Complexity
**O(1)**
The solution uses a fixed amount of extra space for a few integer variables (`i`, `num`, `sum`, `temp`), regardless of the input array's size.

## Key Takeaway
For problems asking to find the "smallest" or "first" occurrence of something in a linear scan, iterating from the beginning and returning immediately upon finding the first valid instance is an efficient and standard approach.

---

Generated automatically by LeetCode AutoSync AI.
