// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const debug = true;
// const baseapiurl = debug ? '/api/' : 'http://localhost:' + serverport + '/api/';
const baseapiurl = !debug ? '/api/' : 'http://savvylink.savvyasia.com/api/';
const baseurl = !debug ? '/' : 'http://savvylink.savvyasia.com/';

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
