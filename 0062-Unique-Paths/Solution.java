class Solution {
    public int uniquePaths(int m, int n) {
        return counter(m - 1, n -1);    
    }
    private int counter(int r, int col){
        if(r == 0 && col == 0){
            return 1;
        }
        if(r < 0 || col < 0){
            return 0;
        }
        int up = counter(r-1, col);
        int left = counter(r, col - 1);
        return (up+left);
    }
}