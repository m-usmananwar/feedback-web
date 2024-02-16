import { createStore } from "vuex";

const initialState = {
  user: null,
};

export default createStore({
  state: initialState,
  
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  getters: {
    currentUser(state) {
      return state.user;
    },
  },
});
