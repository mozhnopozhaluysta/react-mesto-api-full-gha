import React from "react"

function Footer() {
  return (
    <footer className="footer page__footer">
      <p className="footer__copyright">
        © {new Date().getFullYear()}. практикум х Буштаева Тома
      </p>
    </footer>
  )
}

export default Footer
