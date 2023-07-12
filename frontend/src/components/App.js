import React, { useState, useEffect } from "react"
import Header from "../components/Header"
import Main from "../components/Main"
import Footer from "../components/Footer"
import EditProfilePopup from "./EditProfilePopup"
import EditAvatarPopup from "./EditAvatarPopup"
import AddPlacePopup from "./AddPlacePopup"
import PopupConfirmation from "../components/PopupConfirmation"
import ImagePopup from "../components/ImagePopup"
import { CurrentUserContext } from "../contexts/CurrentUserContext"
import api from "../utils/Api"
import { Route, Switch, Redirect, useHistory } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import Register from "./Register"
import Login from "./Login"
import * as auth from "../utils/auth"
import InfoToolTip from "./InfoToolTip"

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const [deletedCard, setDeletedCard] = useState({})
  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState([])

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const history = useHistory()
  const [isInfoToolTipPopupOpen, setInfoToolTipPopupOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    console.log(jwt)
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true)
          setEmail(res.email)

          history.push("/")
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log("401 — Токен не передан или передан не в том формате")
          }
          console.log("401 — Переданный токен некорректен")
          console.log(err.status, err.message, err.stack)
        })
    }
  }, [history])

  useEffect(() => {
    isLoggedIn &&
      Promise.all([api.getRealUserInfo(), api.getInitialCards()])
        .then(([profileInfo, cards]) => {
          setCurrentUser(profileInfo)
          setCards(cards.data.reverse())
        })
        .catch((error) => console.log(`Ошибка: ${error}`))
  }, [isLoggedIn])

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsConfirmationPopupOpen(false)
    setDeletedCard({})
    setSelectedCard({})
    setInfoToolTipPopupOpen(false)
  }

  function closeByOverlay(evt) {
    if (evt.target === evt.currentTarget) {
      console.log()
      closeAllPopups()
    }
  }

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isConfirmationPopupOpen ||
    selectedCard.link

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups()
      }
    }
    if (isOpen) {
      // навешиваем только при открытии
      document.addEventListener("keydown", closeByEscape)
      return () => {
        document.removeEventListener("keydown", closeByEscape)
      }
    }
  }, [isOpen])

  function changeUpdateAvatar(newAvatar) {
    setIsLoading(true)
    api
      .updateProfileUserAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  function changeUpdateUser(newUserInfo) {
    setIsLoading(true)
    api
      .editProfileUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  function changeAddPlaceSubmit(data) {
    setIsLoading(true)
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards([newCard.data, ...cards])
        console.log(cards)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  function changeCardLike(card) {
    const isLiked = card.likes.some((user) => user === currentUser._id)
    ;(isLiked ? api.removeLike(card._id) : api.addLike(card._id, true))
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === newCard.data._id ? newCard.data : c))
        )
      })
      .catch((err) => console.log(err))
  }

  function handleCardDelete(card) {
    setIsLoading(true)
    api
      .removeCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id))
        closeAllPopups()
      })

      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  function changeRegSubmit(email, password) {
    //console.log(email, password)
    auth
      .registration(email, password)
      .then((res) => {
        setInfoToolTipPopupOpen(true)
        setIsSuccess(true)
        // console.log(res)
        history.push("/sign-in")
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - некорректно заполнено одно из полей")
        }
        console.log("все плохо с регистрацией")
        setInfoToolTipPopupOpen(true)
        setIsSuccess(false)
      })
  }

  function changeLoginSubmit(email, password) {
    //console.log(email, password)
    auth
      .login(email, password)

      .then((res) => {
        // console.log(res)
        localStorage.setItem("jwt", res.token)
        // console.log(res.token)
        setIsLoggedIn(true)
        setEmail(email)
        // console.log(res)
        history.push("/")
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - не передано одно из полей")
        } else if (err.status === 401) {
          console.log("401 - пользователь с email не найден")
        }
        console.log("неполучается залогиниться по зарегистрированным данным")
        setInfoToolTipPopupOpen(true)
        setIsSuccess(false)
      })
  }

  function changeSignOut() {
    localStorage.removeItem("jwt")
    setIsLoggedIn(false)
    setIsMobileMenuOpen(false)
    history.push("/sign-in")
    setIsMobileMenuOpen(false)
  }

  function changeOpenMobileMenu() {
    if (isLoggedIn) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Header
            email={email}
            onSignOut={changeSignOut}
            isMobileMenuOpen={isMobileMenuOpen}
            changeOpenMobileMenu={changeOpenMobileMenu}
            isLoggedIn={isLoggedIn}
          />

          <Switch>
            <ProtectedRoute
              exact
              path="/"
              isLoggedIn={isLoggedIn}
              onEditAvatar={setIsEditAvatarPopupOpen}
              onEditProfile={setIsEditProfilePopupOpen}
              onConfirmationPopup={setIsConfirmationPopupOpen}
              onAddPlace={setIsAddPlacePopupOpen}
              onCardClick={setSelectedCard}
              onCardLike={changeCardLike}
              onDeletedCard={setDeletedCard}
              cards={cards}
              component={Main}
              isLoading={isLoading}
            />
            <Route path="/sign-in">
              <Login onLogin={changeLoginSubmit} />
            </Route>
            <Route path="/sign-up">
              <Register onRegister={changeRegSubmit} />
            </Route>
            <Route>
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          {isLoggedIn && <Footer />}
          <AddPlacePopup
            onAddPlace={changeAddPlaceSubmit}
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onUpdateUser={changeUpdateUser}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <EditAvatarPopup
            onUpdateAvatar={changeUpdateAvatar}
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <PopupConfirmation
            onClose={closeAllPopups}
            isOpen={isConfirmationPopupOpen}
            onCardDelete={handleCardDelete}
            onLoading={isLoading}
            card={deletedCard}
            onCloseOverlay={closeByOverlay}
          />

          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            onCloseOverlay={closeByOverlay}
          />

          <InfoToolTip
            isOpen={isInfoToolTipPopupOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccess}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
