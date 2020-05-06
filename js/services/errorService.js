export default class errorService {
    constructor() {
        window.addEventListener('error', function (error) {
            this.console.log(error);
            let forcast = document.querySelector('.forcast');
            forcast.innerHTML = "something went wrong! please refresh the page";
            let favorites = document.querySelector('.favorites');
            favorites.innerHTML = "something went wrong! please refresh the page";
        })
    };

    displayError(msg) {
        alert(msg);
    }
}
