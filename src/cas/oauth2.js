import querystring from "querystring";

export function initOauthUrl() {
   let oauth2Url = process.env.VUE_APP_CAS_PREFIX_URL + process.env.VUE_APP_OAUTH2_AUTHORIZATION_URL;
   oauth2Url +=
      "?" +
      querystring.stringify({
         client_id: process.env.VUE_APP_OAUTH2_CLIENTID,
         // redirect_uri: process.env.VUE_APP_FRONT_URL
         redirect_uri: location.href
      });
   return oauth2Url;
}

//http://192.168.21.69/cas/oauth2.0/authorize?client_id=eb728e3137ca33e6&redirect_uri=http://192.168.21.69&state=state
