class Solution {
    public int minOperations(String s) {
        char[] arr = s.toCharArray();
        char[] after = s.toCharArray();
        int n = arr.length;
        int ans = -1;
        Arrays.sort(after);
        if(Arrays.equals(arr, after)){
            return 0;
        }else if(arr[0] == after[0] || arr[n-1] == after[n-1]){
            return 1;
        }else{
            if(n == 2){
                return -1;
            }
            return 2;
        }
    }
}