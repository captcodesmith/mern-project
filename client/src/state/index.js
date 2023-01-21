import { createSlice } from '@reduxjs/toolkit';

/* STATE WHICH WILL BE USED IN ALL THE COMPONENTS */
const initialState = {
  mode: 'light', // dark mode or light mode
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // reducers are basically an object with all the actions (functions)
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error('user friends non-existent :(');
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPost = state.posts.map((post) => {
        if (post._id === action.payload._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPost;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;

export default authSlice.reducer;
