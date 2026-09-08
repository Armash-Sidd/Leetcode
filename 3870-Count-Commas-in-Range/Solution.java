class Solution {
    public int countCommas(int n) {
        if(n < 1000){
            return 0;
        }
        int comma = 1;
        int start = 1000;
        int ans = 0;
        while(start <= n){
            int last = start * 1000 -1;
            int count = Math.min(n, last) - start +1;
            if(count > 0){
                ans += count * comma;
            }
            start *= 1000;
            comma++;
        }
        return ans;
    }
}