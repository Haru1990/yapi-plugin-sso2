const request = require('request');

module.exports = function (options) {
  const { loginUrl, emailPostfix } = options;

  this.bindHook('third_login', (ctx) => {
    console.log(ctx.header.cookie, 'ctx');
    return new Promise((resolve, reject) => {
      request({
        url: loginUrl,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          // 主要是cookie中的CASTGC信息
          'Cookie': ctx.header.cookie || '',
        },
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let result = JSON.parse(body);
          if (result && result.errno === 0) {
            let ret = {
              email: result.data.email_addr,
              username: result.data.uname
            };
            resolve(ret);
          } else {
            reject(result);
          }
        }
        reject(error);
      });
    });
  })
}
