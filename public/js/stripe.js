// /* eslint-disable */
const stripe = Stripe(
  'pk_test_51NPhPxSFtNwjVDe3kH4TAQDhuYxizeC9v9hZWSKpFbMcsSxDZaBLXshJcrfYciPqC471fl7YVPc9vd5lGmGR11bO00JktmGwnP'
);
const booktour = async (tourid) => {
  try {
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourid}`
    );
    console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showalert('error', err);
  }
};
const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    console.log('clicked');
    e.target.textContent = `Processing ...`;
    const { tourId } = e.target.dataset;
    booktour(tourId);
  });
}
