/**
 *  存放cookie
 * @param name 每一个cookie名
 * @param value 每一个cookie值
 * @param opts 设置cookie存放机制
 */
export function setCookie(name, value, opts) {
  if (!opts)
    opts = {};
  let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
  if (opts.maxAge)
    cookie += '; Max-Age=' + opts.maxAge; // 最大保存期限
  if (opts.expires)
    // 有效期 比如7天
    cookie += '; Expires=' + (opts.expires.constructor == Date ? opts.expires.toUTCString() : new Date(opts.expires).toUTCString());
  if (opts.path)
    cookie += '; Path=' + opts.path; // 服务器路径
  if (opts.domain)
    cookie += '; Domain=' + opts.domain; // 域名
  if (opts.secure)
    cookie += '; Secure';  // 安全
  document.cookie = cookie;
}

/**
 *  获取cookie
 * @param name  每一个cookie名
 * @returns {any}  返回的对应cookie的值
 */
export function getCookie(name) {
  let result = document.cookie.match(new RegExp('(?:^|; )' + encodeURIComponent(name).replace(/[.*()]/g, '\\$&') + '=([^;]*)'));
  return result ? decodeURIComponent(result[1]) : null;
}

/**
 *  移除某一个cookie
 * @param name 对应cookie名
 * @param opts 各种配置
 */
export function removeCookie(name, opts) {
  if (!opts)
    opts = {};
  opts.maxAge = 0;
  let set = function (name, value, opts) {
    if (!opts)
      opts = {};
    let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (opts.maxAge)
      cookie += '; Max-Age=' + opts.maxAge;
    if (opts.expires)
      cookie += '; Expires=' + (opts.expires.constructor == Date ? opts.expires.toUTCString() : new Date(opts.expires).toUTCString());
    if (opts.path)
      cookie += '; Path=' + opts.path;
    if (opts.domain)
      cookie += '; Domain=' + opts.domain;
    if (opts.secure)
      cookie += '; Secure';
    document.cookie = cookie;
  }
  set(name, '', opts);
}

/**
 * 删除所有cookie
 */
export function removeAllCookie() {
  let cookies = document.cookie.split(';')
  let remove = function (name, opts) {
    if (!opts)
      opts = {};
    opts.maxAge = 0;
    let set = function (name, value, opts) {
      if (!opts)
        opts = {};
      let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      if (opts.maxAge)
        cookie += '; Max-Age=' + opts.maxAge;
      if (opts.expires)
        cookie += '; Expires=' + (opts.expires.constructor == Date ? opts.expires.toUTCString() : new Date(opts.expires).toUTCString());
      if (opts.path)
        cookie += '; Path=' + opts.path;
      if (opts.domain)
        cookie += '; Domain=' + opts.domain;
      if (opts.secure)
        cookie += '; Secure';
      document.cookie = cookie;
    }
    set(name, '', opts);
  }
  for (let i = 0; i < cookies.length; i++) {
    let key = cookies[i].split('=')[0].replace(/\s/g, '');
    remove(key);
  }
}

