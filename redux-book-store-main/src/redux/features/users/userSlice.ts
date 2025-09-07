// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import axios from 'axios';
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
// import { auth } from '../../../utils/firebase';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from 'firebase/auth';

// interface IUserState {
//   user: {
//     email: string | null;
//   };
//   isLoading: boolean;
//   isError: boolean;
//   error: string | null;
// }

// interface ICredential {
//   email: string;
//   password: string;
// }

// const initialState: IUserState = {
//   user: {
//     email: null,
//   },
//   isLoading: false,
//   isError: false,
//   error: null,
// };

// export const createUser = createAsyncThunk(
//   'user/createUser',
//   async (
//     {
//       name,
//       email,
//       password,
//     }: { name: string; email: string; password: string },
//     thunkAPI
//   ) => {
//     try {
//       const res = await axios.post('http://localhost:4040/api/auth/register', {
//         name,
//         email,
//         password,
//       });

//       const { token, user } = res.data;

//       localStorage.setItem('token', token);
//       return user;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   'user/loginUser',
//   async (
//     { email, password }: { email: string; password: string },
//     thunkAPI
//   ) => {
//     try {
//       const response = await axios.post(
//         'http://localhost:4040/api/auth/login',
//         {
//           email,
//           password,
//         }
//       );

//       const { token, user } = response.data;

//       // 🔐 Store token locally so SubmitNotice and others can use it
//       localStorage.setItem('token', token);

//       return user;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );

// const userSlice = createSlice({
//   name: 'user ',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<string | null>) => {
//       state.user.email = action.payload;
//     },
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.isLoading = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createUser.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//         state.error = null;
//       })
//       .addCase(createUser.fulfilled, (state, action) => {
//         state.user.email = action.payload;
//         state.isLoading = false;
//       })
//       .addCase(createUser.rejected, (state, action) => {
//         state.user.email = null;
//         state.isLoading = false;
//         state.isError = true;
//         state.error = action.error.message!;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.user.email = action.payload;
//         state.isLoading = false;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.user.email = null;
//         state.isLoading = false;
//         state.isError = true;
//         state.error = action.error.message!;
//       });
//   },
// });

// export const { setUser, setLoading } = userSlice.actions;

// export default userSlice.reducer;

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface IUserState {
  user: { email: string | null };
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: { email: null },
  isLoading: false,
  isError: false,
  error: null,
};

// Use env base URL; fallback to localhost for dev
const API_BASE =
  import.meta?.env?.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

/** Register -> returns the email string to store in Redux */
export const createUser = createAsyncThunk(
  'user/createUser',
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
      });

      const { token, user } = res.data || {};
      // Persist auth for the rest of the app
      if (token) localStorage.setItem('token', token);
      if (user?.role) localStorage.setItem('role', user.role);
      if (user?.name) localStorage.setItem('userName', user.name);
      if (user?.email) localStorage.setItem('userEmail', user.email);

      // Return just the email for this slice
      return (user?.email as string) || email;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || 'Registration failed';
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

/** Login -> returns the email string to store in Redux */
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data || {};
      if (token) localStorage.setItem('token', token);
      if (user?.role) localStorage.setItem('role', user.role);
      if (user?.name) localStorage.setItem('userName', user.name);
      if (user?.email) localStorage.setItem('userEmail', user.email);

      return (user?.email as string) || email;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || 'Login failed';
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** Accepts a string email or null */
    setUser: (state, action: PayloadAction<string | null>) => {
      state.user.email = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user.email = null;
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      // Clear storage too (helper)
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.user.email = action.payload || null;
        state.isLoading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.user.email = null;
        state.isLoading = false;
        state.isError = true;
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user.email = action.payload || null;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user.email = null;
        state.isLoading = false;
        state.isError = true;
        state.error =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export const { setUser, setLoading, logout } = userSlice.actions;
export default userSlice.reducer;
