/* eslint-disable no-alert */
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function checkCookie() {
  let user = getCookie('username');
  if (user !== '') {
    alert(`Welcome again ${user}`);
  } else {
    user = prompt('Please enter your name:', '');
    if (user !== '' && user != null) {
      setCookie('username', user, 365);
    }
  }
}

export { setCookie, getCookie, checkCookie };
