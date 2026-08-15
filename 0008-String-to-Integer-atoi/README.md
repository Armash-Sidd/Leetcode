# 8. String to Integer (atoi)

**Difficulty:** `Medium`  
**Language:** `Java`  
**Date Solved:** `2026-08-15`  

---

## Solution

See `Solution.java`

---

## AI Explanation

Here's a breakdown of the provided LeetCode solution snippet for "String to Integer (atoi)":

## Approach
This solution first iterates to skip any leading whitespace characters. It then identifies an optional sign (`-` is shown, `+` would typically also be handled) which determines the number's polarity. It subsequently processes consecutive digit characters, converting them into an accumulating integer, with the implicit but crucial step of checking for integer overflow/underflow at each stage before appending the next digit.

## Time Complexity
**O(N)**, where N is the length of the input string `s`. The algorithm makes a single pass over the string to skip leading spaces, identify the sign, and extract numerical digits.

## Space Complexity
**O(1)**. The solution uses a constant amount of extra space for variables like pointers (`i`, `j`), the accumulating result (`ans`), and the current digit, irrespective of the input string's length.

## Key Takeaway
The most critical aspect of implementing `atoi` correctly, which is not fully visible in this snippet but is a primary interview challenge, is handling **integer overflow and underflow**. A robust solution must include checks *before* each numerical accumulation step to ensure that `ans * 10 + digit` does not exceed `Integer.MAX_VALUE` or fall below `Integer.MIN_VALUE`.

---

Generated automatically by LeetCode AutoSync AI.
