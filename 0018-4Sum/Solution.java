class Solution {
    public List<List<Integer>> fourSum(int[] 
    nums, int target) {
        Arrays.sort(nums);
        List<List<Integer>> sol = new 
        ArrayList<>();
        for(int i = 0; i < nums.length - 3; i
        ++){
            if(i > 0 && nums[i] == nums[i-1]){
                continue;
            }
            for(int j = i+1; j < nums.length - 
            2; j++){
                if(j > i+1 && nums[j] == nums
                [j-1]){
                    continue;
                }
                int l = j + 1;
                int r = nums.length - 1;
