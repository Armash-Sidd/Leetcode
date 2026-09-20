class Solution {
    public int reverseDegree(String s) {
        int [] arr = new int[26];
        for(int i = 0; i < 26; i++){
            arr[i] = 26-i;
        }
        int ans = 0;
        int n = s.length();

        for(int i = 0; i < n; i++){
            int temp = s.charAt(i) - 'a';
            ans += (arr[temp]*(i+1));
        }
        return ans;
    }
}