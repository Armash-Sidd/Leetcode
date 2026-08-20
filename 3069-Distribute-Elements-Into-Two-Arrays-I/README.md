# 3069. Distribute Elements Into Two Arrays I

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-08-20`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution initializes two dynamic arrays (`ArrayList`s), `arr1` and `arr2`, with the first two elements from the input `nums` array, respectively. It then iterates through the remaining elements of `nums` starting from the third element. In each step, it compares the last element of `arr1` with the last element of `arr2`. If the last element of `arr1` is greater, the current element from `nums` is added to `arr1`; otherwise, it's added to `arr2`. Finally, the elements of `arr1` are concatenated with the elements of `arr2` into a new `int[]` result array.

## Time Complexity
**O(n)**.
The initialization steps are O(1). The main loop iterates `n-2` times, and inside the loop, accessing the last element of an `ArrayList` and adding an element are amortized O(1) operations. The final step of merging the two `ArrayList`s into the result array also takes O(n) time, as it iterates through all `n` elements once.

## Space Complexity
**O(n)**.
Two `ArrayList`s (`arr1` and `arr2`) are used to store all `n` elements from the input array. Additionally, a new `int[]` array of size `n` is created to store the final result. Therefore, the total space complexity is proportional to the number of elements `n`.

## Key Takeaway
The solution demonstrates efficient use of `ArrayList`s in Java for dynamic array management. `ArrayList`'s `add()` operation (appending to the end) and `get(size()-1)` (accessing the last element) are amortized O(1), which is critical for achieving the optimal O(n) time complexity in this problem where elements are only added to the end and only the last element is compared. This choice is superior to `LinkedList` if only appends and last element access are required, as `ArrayList` maintains cache locality.

---

Generated automatically by LeetCode AutoSync AI.
