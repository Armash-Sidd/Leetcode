class Solution {
    public int longestMonotonicSubarray(int[] nums) {
        int n = nums.length;
        int l = 0;
        int ans = 1; 
        for(int i = 1; i < n; i++){
            if(nums[i] > nums[i-1]){
                ans = Math.max(ans, i - l + 1);
            }else{
                l = i;
            }
        }
        l = 0;
        for(int i = 1; i < n; i++){
            if(nums[i] < nums[i-1]){
                ans = Math.max(ans, i - l + 1);
            }else{
                l = i;
            }
        }
        return ans;
    }
}