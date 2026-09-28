# 1614. Maximum Nesting Depth of the Parentheses

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-09-28`  

---

## Solution

See `Solution.java`

---

## AI Explanation

```markdown
## Approach
The solution iterates through the input string character by character. It utilizes a stack to keep track of the current nesting depth: pushing an element when an opening parenthesis `(` is encountered, and popping when a closing parenthesis `)` is found. After each character is processed, the maximum size observed for the stack is updated, representing the maximum nesting depth encountered so far.

## Time Complexity
**O(n)**, where `n` is the length of the input string `s`. The algorithm makes a single pass over the string, performing constant-time operations (stack push, pop, size, and comparison) for each character.

## Space Complexity
**O(n)**, where `n` is the length of the input string `s`. In the worst-case scenario (e.g., a string like "(((" where all parentheses are opening), the stack could grow to store up to `n/2` characters.

## Key Takeaway
While a stack correctly solves this problem, it's possible to achieve **O(1) space complexity** by simply using an integer counter. Increment the counter for `(` and decrement for `)`, continuously updating a `max_depth` variable with the highest value the counter reaches. This optimization is a common interview point for this specific problem.
```

---

Generated automatically by LeetCode AutoSync AI.
