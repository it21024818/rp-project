import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store'; // Import your RootState type if needed
import { logoutCurrentUser, setUser } from '../store/userSlice'; // Actions for managing user state

// Define the interface for the refresh token API response
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Define the baseQuery with automatic token refresh logic
const baseQueryWithReauth = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_EXTERNAL_URL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  }
});

// Custom base query with reauthentication
export const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQueryWithReauth(args, api, extraOptions);

  // If the result is a 401 (unauthorized), try refreshing the token
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQueryWithReauth(
        {
          url: '/v1/auth/refresh',
          method: 'POST',
          body: { refreshToken }
        },
        api,
        extraOptions
      );

      // Typecast refreshResult.data to the expected RefreshTokenResponse
      const refreshData = refreshResult.data as RefreshTokenResponse;

      if (refreshData?.accessToken) {
        // If refresh is successful, store the new tokens
        localStorage.setItem('accessToken', refreshData.accessToken);
        localStorage.setItem('refreshToken', refreshData.refreshToken);

        // Optionally, dispatch the updated user details (e.g., new tokens)
        api.dispatch(setUser(refreshData));

        // Retry the original request with the new access token
        result = await baseQueryWithReauth(args, api, extraOptions);
      } else {
        // If refresh fails, log out the user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        api.dispatch(logoutCurrentUser());
      }
    } else {
      // No refresh token, log out the user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      api.dispatch(logoutCurrentUser());
    }
  }

  return result;
};
