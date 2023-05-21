const rain = document.querySelector(".rain")
const rainButton = document.querySelector(".footer__rain-button")
const themeText = document.querySelector(".footer__theme-button-p")
const themeButton = document.querySelector(".footer__theme-button")
const rainText = document.querySelector(".footer__rain-button-p")

const elementsWithTheme = document.querySelectorAll(".theme");

if (localStorage["notFirstTime"] == undefined) {
    setTimeout(function() {
        alert("ку");
        localStorage["notFirstTime"] = true;
    }, 30000);
}
function changeConditionRain() {
    rain.classList.toggle("rain_disabled")
    rainButton.classList.toggle("footer__rain-button_off")
    if (rainText.textContent === "Нажми и будет дождь") {
        rainText.textContent = "Нажми и дождь закончится"
    } else {
        rainText.textContent = "Нажми и будет дождь"
    }
}

rainButton.addEventListener("click", changeConditionRain)

function changeTheme() {
    elementsWithTheme.forEach(function(element) {
        element.classList.toggle(`${element.classList[0]}_theme_light`);
        element.classList.toggle(`${element.classList[0]}_theme_dark`);
    });
    if (themeText.textContent === "Нажми и будет светлая тема") {
        themeText.textContent = "Нажми и будет темная тема"
    } else {
        themeText.textContent = "Нажми и будет светлая тема"
    }
}

themeButton.addEventListener("click", changeTheme)

const popups = document.querySelectorAll(".popup");

function addEscape(evt) {
    if (evt.key === "Escape") {
        const openedPopup = document.querySelector('.popup_opened');
        closePopup(openedPopup);
    }
}

function closePopup(popup) {
    popup.classList.remove('popup_opened');
    const currentImg = document.querySelector('.current');
    if (currentImg) {
        currentImg.classList.remove("current");
    }
    document.removeEventListener('keydown', addEscape);
}

function openPopup(popup) {
    popup.classList.add('popup_opened');
    document.addEventListener('keydown', addEscape);
}

function setEventListenersForPopups(popups) {
    Array.from(popups).forEach(function(popupElement) {
        popupElement.addEventListener('click', function(evt) {
            if (evt.target === popupElement) {
                closePopup(popupElement);
            }
        })
    });
}

const viewerPopup = document.querySelector(".popup_viewer");
const imageViewer = viewerPopup.querySelector(".popup__image");
const rightArrow = viewerPopup.querySelector(".popup__arrow-right");
const leftArrow = viewerPopup.querySelector(".popup__arrow-left");

rightArrow.addEventListener('click', function () {
    const currentImg = document.querySelector(".current");
    currentImg.classList.remove("current");
    currentImg.nextElementSibling.classList.add("current");
    imageViewer.src = currentImg.nextElementSibling.src;
    renderArrows(currentImg.nextElementSibling);
})

leftArrow.addEventListener('click', function () {
    const currentImg = document.querySelector(".current");
    currentImg.classList.remove("current");
    currentImg.previousElementSibling.classList.add("current");
    imageViewer.src = currentImg.previousElementSibling.src;
    renderArrows(currentImg.previousElementSibling);
})

const images = document.querySelectorAll(".gallery-container__image");
images.forEach(function(imageElement) {
    const link = imageElement.src;
    imageElement.addEventListener('click', function(evt) {
        imageViewer.src = link;
        renderArrows(imageElement);
        openPopup(viewerPopup);
        imageElement.classList.add("current");
    });
})
function renderArrows(image) {
    if (!image.nextElementSibling) {
        rightArrow.classList.add("popup__arrow-right_disabled");
        leftArrow.classList.remove("popup__arrow-left_disabled");
    } else {
        if (!image.previousElementSibling) {
            leftArrow.classList.add("popup__arrow-left_disabled");
            rightArrow.classList.remove("popup__arrow-right_disabled");
        } else {
            leftArrow.classList.remove("popup__arrow-left_disabled");
            rightArrow.classList.remove("popup__arrow-right_disabled");
        }
    }
}

setEventListenersForPopups(popups);

const parameters = {
    formSelector: '.popup__form',
    inputSelector: '.popup__form-text-input',
    submitButtonSelector: '.popup__form-submit-button',
    inactiveButtonClass: 'button_inactive',
    inputErrorClass: 'popup__form-text-input_type_error',
    errorClass: 'popup__form-error_active'
}

function uncorrectEmail(inputElement) {
    const inputValue = inputElement.value.split(".");
    if (inputValue.length <= 1) {
        return true;
    }
    const emailEnd = inputValue.pop();
    return emailEnd.length < 2 || emailEnd.length > 6 || !(/[a-z]/i.test(emailEnd));
}

function uncorrectTel(inputElement) {
    const inputValue = inputElement.value.split("+");
    const telEnd = inputValue.pop();
    return Number.isNaN(Number(telEnd)) || telEnd.length !== 11 || (inputValue.length === 1 && inputValue[0] !== "") || inputValue.length > 1;
}

function hasInvalidInput(inputsList) {
    return inputsList.some(function(inputElement) {
        return !inputElement.validity.valid || (inputElement.type === "email" && uncorrectEmail(inputElement)) || (inputElement.type === "tel" && uncorrectTel(inputElement));
    });
}

function toggleButton(inputsList, buttonElement, inactiveButtonClass) {
    if (hasInvalidInput(Array.from(inputsList))) {
        buttonElement.classList.add(inactiveButtonClass);
        buttonElement.disabled = true;
    } else  {
        buttonElement.classList.remove(inactiveButtonClass);
        buttonElement.disabled = false;
    }
}

function showInputError(formElement, inputElement, errorMessage, inputErrorClass, errorClass) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(errorClass);
    if (inputElement.type === "email" && uncorrectEmail(inputElement)) {
        inputElement.classList.add(inputErrorClass);
        errorElement.textContent = "Некорректный email";
    }
    if ((inputElement.type === "tel" && uncorrectTel(inputElement))) {
        inputElement.classList.add(inputErrorClass);
        errorElement.textContent = "Некорректный телефон";
    }
}

function hideInputError(formElement, inputElement, inputErrorClass, errorClass) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(inputErrorClass);
    errorElement.classList.remove(errorClass);
    errorElement.textContent = '';
}

function enableValidation(parameters) {
    const formsList = Array.from(document.querySelectorAll(parameters.formSelector));
    formsList.forEach(function(formElement) {
        formElement.addEventListener('submit', function (evt) {
            evt.preventDefault();
        });

        const inputsList = Array.from(formElement.querySelectorAll(parameters.inputSelector));
        const buttonElement = formElement.querySelector(parameters.submitButtonSelector);
        toggleButton(inputsList, buttonElement, parameters.inactiveButtonClass);

        inputsList.forEach(function(inputElement) {
            inputElement.addEventListener('input', function(evt) {
                toggleButton(inputsList, buttonElement, parameters.inactiveButtonClass);
                if (!inputElement.validity.valid || (inputElement.type === "email" && uncorrectEmail(inputElement)) || (inputElement.type === "tel" && uncorrectTel(inputElement))) {
                    showInputError(formElement, inputElement, inputElement.validationMessage, parameters.inputErrorClass, parameters.errorClass);
                } else {
                    hideInputError(formElement, inputElement, parameters.inputErrorClass, parameters.errorClass);
                }
            })
        })
    });
}

const feedbackPopup = document.querySelector(".popup_form_feedback");
const feedbackForm = feedbackPopup.querySelector(".popup__form");
const feedbackButton = document.querySelector(".footer__feedback-button");
const submitButton = feedbackPopup.querySelector(".popup__form-submit-button")

feedbackButton.addEventListener('click', function (evt) {
    openPopup(feedbackPopup);
})

enableValidation(parameters);

function showLoading() {
    submitButton.value = "Отправляется..."
}

function success() {
    submitButton.value = "Успешная отправка!"
}

function hideLoading() {
    submitButton.value = "Отправить"
}

feedbackForm.addEventListener('submit', function() {
    const telInput = feedbackPopup.querySelector(".popup__form-text-input[name='tel']");
    const emailInput = feedbackPopup.querySelector(".popup__form-text-input[name='email']");
    const textInput = feedbackPopup.querySelector(".popup__form-text-input[name='text']");
    showLoading()
    fetch("", {
        method: "POST",
        body: JSON.stringify({
            tel: telInput.value,
            email: emailInput.value,
            text: textInput.value
        })
    })
        .then(function(res) {
            setTimeout(success, 500);
            setTimeout(function () {
                closePopup(feedbackPopup);
                hideLoading()
            }, 1000);
        })
        .catch(function (err) {
            console.log(err);
        })
})

