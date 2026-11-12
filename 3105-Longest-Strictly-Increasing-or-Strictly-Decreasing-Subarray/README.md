# 3105. Longest Strictly Increasing or Strictly Decreasing Subarray

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-11-12`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
This solution uses a two-pass linear scan approach. The first pass iterates through the array to find the longest strictly increasing subarray, updating the maximum length found so far. The second pass then re-initializes its window and scans the array again to find the longest strictly decreasing subarray, comparing its lengths against the overall maximum. The final maximum length from both passes is returned.

## Time Complexity
**O(N)**. The algorithm performs two separate passes over the input array, each iterating `N-1` times. Each operation within the loop (comparison, assignment, `Math.max`) takes constant time, resulting in a total time complexity proportional to 2N, which simplifies to O(N).

## Space Complexity
**O(1)**. The solution uses a fixed number of auxiliary variables (`n`, `l`, `ans`, `i`) regardless of the input array's size. No data structures that grow with `N` are allocated.

## Key Takeaway
This solution demonstrates a robust way to handle problems asking for "either A or B" longest sequences. By breaking it into two distinct, simpler subproblems (longest increasing, longest decreasing) and combining their maximums, it avoids complex combined logic and remains efficient. It also correctly handles edge cases like arrays with a single element or all equal elements, returning 1.

---

Generated automatically by LeetCode AutoSync AI.
