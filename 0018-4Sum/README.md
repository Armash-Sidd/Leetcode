# 18. 4Sum

**Difficulty:** `Medium`  
**Language:** `Java`  
**Date Solved:** `2026-08-14`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution first sorts the input array. It then uses two nested loops to fix the first two numbers (`nums[i]` and `nums[j]`). Inside these loops, a two-pointer technique (`l` and `r`) is applied to the remaining subarray to find the last two numbers that sum up to `target - nums[i] - nums[j]`. Duplicate numbers for `i` and `j` are skipped to ensure that only unique quadruplets are added to the result.

## Time Complexity
**O(N^3)**. Sorting the array takes `O(N log N)`. The two outer loops iterate approximately `N` times each, and the inner two-pointer scan (which would be a `while` loop not shown in the snippet, but implied by `l` and `r` initialization) takes `O(N)` time in the worst case. Therefore, the dominant part is `N * N * N`, resulting in `O(N^3)`.

## Space Complexity
**O(1)** auxiliary space. The solution only uses a few pointers and variables, requiring a constant amount of extra space. The space used to store the output list is generally not counted towards auxiliary space complexity.

## Key Takeaway
Sorting the array and then efficiently skipping duplicate elements (e.g., `if(i > 0 && nums[i] == nums[i-1]) continue;`) is a critical optimization for k-Sum problems. This prevents adding redundant or identical combinations and significantly helps manage the complexity of finding unique sets in sorted arrays.

---

Generated automatically by LeetCode AutoSync AI.
