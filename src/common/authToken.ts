export function authHeader() {
    const getToken:any = localStorage.getItem("authToken")

    if (getToken) {
      return { Authorization: `Bearer ${getToken}` };
    } else {
      return {};
    }
  }

  export function LoginHeader() {
    const getToken:any = localStorage.getItem("loginToken")

    if (getToken) {
      return { Authorization: `Bearer ${getToken}` };
    } else {
      return {};
    }
  }