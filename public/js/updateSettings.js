// const hidealert = () => {
//   const el = document.querySelector('.alert');
//   if (el) el.parentElement.removeChild(el);
// };

// const showalert = (type, msg) => {
//   hidealert();
//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
//   window.setTimeout(hidealert, 5000);
// };
const UpdateData = async (data, type) => {
  try {
    url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updatemypassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log(res);
    if (res.data.status === 'Success') {
      showalert('success', `${type} Updated successfully`);
    }
  } catch (err) {
    showalert('error', err.response.data.message);
  }
};
const userDataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-settings');
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const email = document.getElementById('email').value;
    // const name = document.getElementById('name').value;
    console.log(form);
    UpdateData(form, 'data');
  });
}
if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = `Updating ...`;
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await UpdateData(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = `Save Password`;
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
