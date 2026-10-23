# 3863. Minimum Operations to Sort a String

**Difficulty:** `Medium`  
**Language:** `Java`  
**Date Solved:** `2026-10-23`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution categorizes the input string based on its current state relative to its lexicographically sorted version. It first checks if the string is already sorted, returning 0 operations if true. Otherwise, it checks if either the first or last character of the original string matches its corresponding position in the sorted string, returning 1 operation in such cases. For a two-character string that doesn't fit the above criteria, it returns -1, and for all other strings, it returns 2 operations.

## Time Complexity
**O(N log N)**.
This is primarily due to the `Arrays.sort(after)` call, which sorts a character array of length N. Converting the string to a character array and comparing arrays take O(N).

## Space Complexity
**O(N)**.
Two character arrays, `arr` and `after`, are created, each storing a copy of the input string, resulting in O(N) space usage.

## Key Takeaway
When a problem asks for "minimum operations," always **clarify the exact definition of an 'operation'** and any specific constraints on them. This solution demonstrates a very problem-specific interpretation of "operations" (0, 1, 2, or -1 based on fixed conditions) rather than a general algorithm to count actual transformative steps.

---

Generated automatically by LeetCode AutoSync AI.
