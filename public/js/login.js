const LoginForm = document.querySelector('.form--login');
const LogOutButton = document.querySelector('.nav__el--logout');
const hidealert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showalert = (type, msg) => {
  hidealert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hidealert, 5000);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'Success') {
      showalert('success', 'Logged in successfully');
      // alert('Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showalert('error', err.response.data.message);
  }
};
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err);
    showalert('error', 'Error logging out');
  }
};
if (LoginForm) {
  LoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (LogOutButton) LogOutButton.addEventListener('click', logout);
