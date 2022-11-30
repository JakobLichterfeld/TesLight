export const isValidSsid = (ssid: string): boolean => {
  if (ssid.length < 2 || ssid.length > 32) {
    return false;
  }

  return /^[0-9a-zA-Z-_ ]+$/.test(ssid);
};

export const isValidPassword = (password: string): boolean => {
  if (password.length < 8 || password.length > 63) {
    return false;
  }

  return /^[0-9a-zA-Z+-_!"§$%&\/()=?*# ]+$/.test(password);
};
