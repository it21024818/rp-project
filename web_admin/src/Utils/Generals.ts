import { useLocation } from 'react-router-dom';

export const toggleLinkClass = (
  path: string,
  activeClass: string = active,
  inactiveClass: string = inactive
) => {
  const currentLink = useLocation().pathname;

  return currentLink === path ? activeClass : inactiveClass;
};

export const getItem = (keymane: string) => {
  return localStorage.getItem(keymane);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const setItem = (keyname: string, value: string | Object) => {
  if (typeof value !== 'string' && !(value instanceof String)) {
    value = JSON.stringify(value);
  }
  return localStorage.setItem(keyname, value as string);
};

export const removeItem = (keyname: string) => {
  return localStorage.removeItem(keyname);
};

// export const link = (url : string) : string => BASE_STORAGE_URL + url;

export const checkLogin = () => {
  const accessToken = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');

  const isLogged = accessToken && user;
  return !!isLogged;
};

export const BASE_URL = 'http://localhost:3000'; // BASE URL FOR API FETCHING

const active = 'd-block p-3 fd-nav-active'; // WHERE MENU IS ACTIVE CLASS

const inactive = 'd-block p-3 text-black'; // WHERE MENU IS NOT ACTIVE CLASS

export const cartKeyName = 'fd_shoppingcart'; // CART KEY NAME FOR LOCAL STORAGE

export const wishlistKeyName = 'fd_wishlist'; // WISHLIST KEY NAME FOR LOCAL STORAGE
