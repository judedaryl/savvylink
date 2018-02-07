const frontEndUrl = 'http://localhost:3000/';
const port = 3000;
module.exports= {
    serverUrl: 'http://localhost:' + port,
    angularRedirect: 'http://localhost:9000/',
    jwt : 'J38duw08123WkzxclkEus7D',
    jwtexpire : 3600*5,

    /**
     * Defaults for registration
     */

    registrationImage: 'http://cnssbenin.org/wp-content/uploads/2017/01/user-1.png',

    /**
     * Facebook authentication
     */
    facebookAppID : 1771565572915560,
    facebookAppSecret : '905a654afb175bc7cb64706c6a8c2c9d',
    facebookSuccessRedirect : frontEndUrl+ 'social/callback/facebook/',
    facebookFailRedirect: frontEndUrl+ 'login',

    /**
     * Github authentication
     */
    githubAppID : 'e2b870047a76278c1f9b',
    githubAppSecret : 'd9681f6b1a79f2163402dd7e271c22a0bf9493c6',
    githubSuccessRedirect : frontEndUrl+ 'social/callback/github/',
    githubFailRedirect: frontEndUrl+ 'login',

    /**
     * LinkedIn authentication
     */
    linkedinAppID : '81wbfwuclvfsgl',
    linkedinAppSecret : 'VMzzvBYrbNhPUrfc',
    linkedinSuccessRedirect : frontEndUrl+ 'social/callback/linkedin/',
    linkedinFailRedirect: frontEndUrl+ 'login',

    /**
     * Google authentication
     */

     googleAppID : '81422354150-f5c7m8tncuibudvu0vjf5tff9sa189ev.apps.googleusercontent.com',
     googleAppSecret : 'WpaxVuTI_UsPV9nh-E2EWS4D',
     googleSuccessRedirect: frontEndUrl+ 'social/callback/google/', 
     googleFailRedirect: frontEndUrl+ 'login',

}