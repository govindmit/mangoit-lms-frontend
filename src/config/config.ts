//SERVER API URL
export const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

// FRONTEND SERVER URL
export const FRONTEND_BASE_URL = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}`;

// //FRONTEND LOCAL URL
// export const FRONTEND_BASE_URL = `${process.env.NEXT_PUBLIC_LOCAL_FRONTEND_BASE_URL}`;

// // // LOCAL API URL
// export const BASE_URL = `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}`;

export const API = {
  authToken: `${BASE_URL}/${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
  register: `${BASE_URL}/${process.env.NEXT_PUBLIC_REGISTER}`,
  login: `${BASE_URL}/${process.env.NEXT_PUBLIC_LOGIN}`,
  forgotPassword: `${BASE_URL}/${process.env.NEXT_PUBLIC_FORGOT_PASSWORD}`,
  resetPassword: `${BASE_URL}/${process.env.NEXT_PUBLIC_RESET_PASSWORD}`,

  userInfoById: `${BASE_URL}/${process.env.NEXT_PUBLIC_GET_USER_BY_ID}`,
  userUpdateById: `${BASE_URL}/${process.env.NEXT_PUBLIC_UPDATE_USER_BY_ID}`,

  getCourses: `${BASE_URL}/${process.env.NEXT_PUBLIC_GET_COURSES}`,
  getCoursesByCouseId: `${BASE_URL}/${process.env.NEXT_PUBLIC_GET_COURSES_BY_COURSE_ID}`,
  createCourse: `${BASE_URL}/${process.env.NEXT_PUBLIC_CREATE_COURSE}`,
  updateCourse: `${BASE_URL}/${process.env.NEXT_PUBLIC_UPDATE_COURSE}`,
  deleteCourse: `${BASE_URL}/${process.env.NEXT_PUBLIC_DELETE_COURSE}`,

  getAllModules: `${BASE_URL}/${process.env.NEXT_PUBLIC_GET_ALL_MODULES}`,
  createModule: `${BASE_URL}/${process.env.NEXT_PUBLIC_CREATE_MODULE}`,
  updateModule: `${BASE_URL}/${process.env.NEXT_PUBLIC_UPDATE_MODULE}`,

  getSessions: `${BASE_URL}/${process.env.NEXT_PUBLIC_GET_SESSION}`,
  createSession: `${BASE_URL}/${process.env.NEXT_PUBLIC_CREATE_SESSION}`,
  deleteSession: `${BASE_URL}/${process.env.NEXT_PUBLIC_DELETE_SESSION}`,
  updateSession: `${BASE_URL}/${process.env.NEXT_PUBLIC_UPDATE_SESSION}`,

  getSite: `${BASE_URL}/${process.env.NEXT_PUBLIC_SITE_CONFIG_GET}`,
  createSite: `${BASE_URL}/${process.env.NEXT_PUBLIC_SITE_CONFIG_CREATE}`,
  deleteSite: `${BASE_URL}/${process.env.NEXT_PUBLIC_SITE_CONFIG_DELETE}`,
  updateSite: `${BASE_URL}/${process.env.NEXT_PUBLIC_SITE_CONFIG_UPDATE}`,

  getSubscription: `${BASE_URL}/${process.env.NEXT_PUBLIC_GET_SUBSCRIPTION}`,
  getSubsById: `${BASE_URL}/${process.env.NEXT_PUBLIC_GET_SUBSCRIPTION_BY_ID}`,

  getOrder: `${BASE_URL}/${process.env.NEXT_PUBLIC_GET_ORDER_BY_USER_ID}`,

  //accept payment
  acceptpayment: `${BASE_URL}/${process.env.NEXT_PUBLIC_ACCEPT_PAYMENT}`,
};
