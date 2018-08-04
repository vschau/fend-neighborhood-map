export default function register() {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log("Registration worked!");
  }).catch((error) => {
    console.log(error)
    console.log("Registration failed!");
  });
}
