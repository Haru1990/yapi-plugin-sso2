import React, { Component } from 'react'
import axios from 'axios'

const qualifyURL = (url, encode) => {
  url = url || '';
  var ret = location.protocol + '//' + location.host + (url.substr(0, 1) === '/' ? '' : location.pathname.match(/.*\//)) + url;
  if (encode) {
    ret = encodeURIComponent(ret);
  }
  return ret;
}

const loginCallback = (options) => {
  const loginURI = '/api/user/login_by_token';
  const { AUTH_SERVER } = options;
  let ret = qualifyURL(loginURI, true);
  let redirectURL = AUTH_SERVER + '?service=' + ret;
  location.href = redirectURL;
}

module.exports = function (options) {
  const handleLogin = () => {
    // 首先判断用户
    axios.get('/api/user/login_by_castgc').then((res) => {
      console.log(res, 'res');
      const { data } = res.data;
      if (data.status) {
        // UUAP用户已经登录
        location.href = '/api/user/login_by_token';
      } else {
        loginCallback(options);
      }
    }).catch((err) => {
      console.log(err);
      loginCallback(options);
    });
  }

  const UuapComponent = () => (
    <button onClick={handleLogin} className="btn-home btn-home-normal" >UUAP 登录</button>
  )

  this.bindHook('third_login', UuapComponent);
};