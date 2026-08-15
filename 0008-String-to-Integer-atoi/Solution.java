class Solution {
    public int myAtoi(String s) {
        int i = 0;
        int ans = 0;
        while (i < s.length() && s.charAt(i) 
        == ' '){
            i++;
        } 
        if(i == s.length()){
            return ans;
        }
        if (s.charAt(i) == '-'){
            i++;
            for (int j = i; j < s.length(); j
            ++){
                if (Character.isDigit(s.charAt
                (j))){
                    int digit = s.charAt(j) - 
                    '0';
