# 2089. Find Target Indices After Sorting Array

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-10-19`  

---

## Solution

See `Solution.java`

---

## AI Explanation

```markdown
## Approach
The solution first sorts the input array `nums` in non-decreasing order. After sorting, it iterates through the modified array, identifying all elements that match the `target`. For each matching element, its current index in the *sorted* array is added to a list, which is then returned.

## Time Complexity
**O(N log N)**
This complexity arises primarily from the `Arrays.sort(nums)` call, which uses a Dual-Pivot Quicksort algorithm for primitive arrays in Java, having an average and worst-case time complexity of O(N log N). The subsequent loop to find target indices takes O(N) time, making the sorting step the dominant factor.

## Space Complexity
**O(N)**
The space complexity is dominated by the `ArrayList` `ans`, which, in the worst-case scenario (e.g., all elements are the target), could store up to N indices. The `Arrays.sort()` method for primitive arrays generally performs an in-place sort, using O(log N) auxiliary space for the recursion stack. Therefore, O(N) for the result list is the primary auxiliary space usage.

## Key Takeaway
This solution correctly interprets the problem's phrasing "target indices *after sorting*." It's crucial to understand whether the problem requires indices from the original array (which would necessitate storing pairs of value and original index) or, as in this case, indices from the array *after* it has been sorted. This emphasizes the importance of carefully reading problem statements regarding array modifications and index references.
```

---

Generated automatically by LeetCode AutoSync AI.
