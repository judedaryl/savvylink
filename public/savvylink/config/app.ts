const serverport = 3000;
const debug = false;
// const baseapiurl = debug ? '/api/' : 'http://localhost:' + serverport + '/api/';
const baseapiurl = debug ? '/api/' : 'http://localhost:3000/api/';
const baseurl = debug ? '/' : 'http://localhost:3000/';
//
export const config = {

    /**
     *  API address
     */
    authApi: baseapiurl + 'auth/',
    orgApi: baseapiurl + 'organization/',
    orgApiEdit: baseapiurl + 'organization/modify',
    orgApibyId: baseapiurl + 'organization/get/byid',
    orgApiByUser: baseapiurl + 'organization/get/user',
    orgApiRemoveById: baseapiurl + 'organization/remove',
    orgApiByContribution: baseapiurl + 'organization/get/contribution',
    checkOrgNameApi: baseapiurl + 'organization/get/checkname',

    contactApiCreate: baseapiurl + 'contact/create',
    contactApiGet: baseapiurl + 'contact/get',
    contactApiEdit: baseapiurl + 'contact/modify',
    contactApiGetByOrg: baseapiurl + 'contact/get/org',
    contactApiGetByUser: baseapiurl + 'contact/get/user',
    contactApiGetByUsers: baseapiurl + 'contact/get/users',
    contactApiRemoveById: baseapiurl + 'contact/remove',


    statisticsApi: baseurl + 'hit',
    regApi: baseurl + 'user/register',
    logApi: baseurl + 'user/login',
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
