const baseapiurl = '/api/';
const baseurl = '/';
export const environment = {
  production: true,
  /**
*  API address
*/
  authApi: baseapiurl + 'auth/',
  orgApi: baseapiurl + 'organization/',
  orgApiGet: baseapiurl + 'organization/get',
  orgApiGetAll: baseapiurl + 'organization/get/all',
  orgApiEdit: baseapiurl + 'organization/modify',
  orgApiCreate: baseapiurl + 'organization/create',
  orgApibyId: baseapiurl + 'organization/get/byid',
  orgApiByUser: baseapiurl + 'organization/get/user',
  orgApiRemoveById: baseapiurl + 'organization/remove',
  orgApiByContribution: baseapiurl + 'organization/get/contribution',
  orgApiContribute: baseapiurl + 'organization/modify/contribute',
  checkOrgNameApi: baseapiurl + 'organization/get/checkname',
  orgApiCount: baseapiurl + 'organization/count',

  contactApiCreate: baseapiurl + 'contact/create',
  contactApiGet: baseapiurl + 'contact/get',
  contactApiEdit: baseapiurl + 'contact/modify',
  contactApiGetByOrg: baseapiurl + 'contact/get/org',
  contactApiGetByOrgContribution: baseapiurl + 'contact/get/org/contribution',
  contactApiGetByUsers: baseapiurl + 'contact/get/users',
  contactApiRemoveById: baseapiurl + 'contact/remove',
  contactApiCount: baseapiurl + 'contact/count',

  statisticsApi: baseurl + 'hit',
  registerApi: baseurl + 'user/register',
  loginApi: baseurl + 'user/login',
  otherUserApi: baseapiurl + 'userapi/username',
  findUserApi: baseapiurl + 'userapi/find',
  checkEmailApi: baseurl + 'user/checkemail',
  checkUsernameApi: baseurl + 'user/checkusername',
  linkedin: baseurl + 'auth/linkedin',

  /**
   * background url
   */
  regBGimage: 'assets/images/stock_photo_reg.jpeg',
};
