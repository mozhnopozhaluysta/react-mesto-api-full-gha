import React, { useState, useEffect } from "react"
import PopupWithForm from "./PopupWithForm"

function AddPlacePopup({
  onClose,
  onAddPlace,
  onLoading,
  isOpen,
  onCloseOverlay,
}) {
  const [name, setName] = useState("")
  const [link, setLink] = useState("")

  useEffect(() => {
    setName("")
    setLink("")
  }, [isOpen])

  function handleSubmit(e) {
    e.preventDefault()
    onAddPlace({
      name: name,
      link: link,
    })
  }

  function handleChangename(e) {
    setName(e.target.value)
  }

  function handleChangelink(e) {
    setLink(e.target.value)
  }

  return (
    <PopupWithForm
      name="popupNewPlace"
      title="Новое место"
      buttonText={onLoading ? `Сохранение` : `Создать`}
      onSubmit={handleSubmit}
      onClose={onClose}
      isOpen={isOpen}
      onCloseOverlay={onCloseOverlay}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_image-name"
          id="nameInputNew"
          name="name"
          type="text"
          value={name}
          onChange={handleChangename}
          placeholder="Название"
          minLength="2"
          maxLength="30"
          required
        />
        <span className="nameInputNew-error error" />
      </label>
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_image-link"
          id="linkInputNew"
          name="link"
          type="url"
          value={link}
          onChange={handleChangelink}
          placeholder="Ссылка на картинку"
          required
        />
        <span className="linkInputNew-error error" />
      </label>
    </PopupWithForm>
  )
}

export default AddPlacePopup
