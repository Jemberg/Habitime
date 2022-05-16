import Cookie from "js-cookie";

export const authenticate = (response, next) => {
  if (response.token !== undefined || response.user !== undefined) {
    Cookie.set("token", response.token, {
      expires: 7,
    });
    console.log(response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    next();
  }
};

export const checkAuthentication = () => {
  if (Cookie.get() && localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  } else return false;
};

export const logOut = (next) => {
  Cookie.remove("token");
  localStorage.removeItem("user");
  next();
};
