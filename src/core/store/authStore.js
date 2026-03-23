/**
 * Simple vanilla store for global state management
 * Alternative to Redux/Zustand - lightweight and framework-agnostic
 */

// Event emitter for state changes
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

// Create store factory
export const createStore = (initialState) => {
  let state = { ...initialState };
  const emitter = new EventEmitter();

  return {
    getState: () => state,
    setState: (partial) => {
      const nextState = typeof partial === 'function' ? partial(state) : partial;
      state = { ...state, ...nextState };
      emitter.emit('change', state);
    },
    subscribe: (callback) => {
      callback(state);
      return emitter.on('change', callback);
    },
    destroy: () => {
      // Cleanup if needed
    }
  };
};

// Auth Store (singleton)
const initialAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Load from localStorage
const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('yaydoom_token') : null;
const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('yaydoom_user') : null;

if (storedToken && storedUser) {
  initialAuthState.token = storedToken;
  initialAuthState.user = JSON.parse(storedUser);
  initialAuthState.isAuthenticated = true;
}

export const authStore = createStore(initialAuthState);

// Auth actions
export const authActions = {
  login: (user, token) => {
    authStore.setState({ user, token, isAuthenticated: true });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('yaydoom_token', token);
      localStorage.setItem('yaydoom_user', JSON.stringify(user));
    }
  },

  logout: () => {
    authStore.setState({ user: null, token: null, isAuthenticated: false });
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('yaydoom_token');
      localStorage.removeItem('yaydoom_user');
    }
  },

  updateUser: (userData) => {
    const currentState = authStore.getState();
    const updatedUser = { ...currentState.user, ...userData };
    authStore.setState({ user: updatedUser });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('yaydoom_user', JSON.stringify(updatedUser));
    }
  },
};

export default authStore;
