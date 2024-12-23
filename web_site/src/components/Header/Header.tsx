import { Container } from "./styles";
import { BrowserRouter as Router } from "react-router-dom";
import { NavHashLink, HashLink } from "react-router-hash-link";
import { useState } from "react";
export function Header() {
  const [isActive, setActive] = useState(false);
  function toggleTheme() {
    let html = document.getElementsByTagName("html")[0];
    html.classList.toggle("light");
  }
  function closeMenu() {
    setActive(false);
  }
  return (
    <Container className="header-fixed">
      <Router>
        <HashLink smooth to="#home" className="logo">
          <span>{"The LightHouse "}</span>
          {/* <span>{" House"}</span> */}
        </HashLink>
        <input
          onChange={toggleTheme}
          className="container_toggle"
          type="checkbox"
          id="switch"
          name="mode"
        />
        {/* <label htmlFor="switch">Toggle</label> */}
        <nav className={isActive ? "active" : ""}>
          <NavHashLink smooth to="#home" onClick={closeMenu}>
            Home
          </NavHashLink>
          {/* <NavHashLink smooth to="#about" onClick={closeMenu}>
            About Us
          </NavHashLink> */}
          <NavHashLink smooth to="#about" onClick={closeMenu}>
            Project Scope
          </NavHashLink>
          <NavHashLink smooth to="#timeline" onClick={closeMenu}>
            Timeline
          </NavHashLink>
          <NavHashLink smooth to="#project" onClick={closeMenu}>
            Downloads
          </NavHashLink>
          <NavHashLink smooth to="#team" onClick={closeMenu}>
            Team
          </NavHashLink>
          <NavHashLink smooth to="#contact" onClick={closeMenu}>
            Contact
          </NavHashLink>
          <a href={"https://detect-lighthouse.me"} className="button" target="_blank" rel="noreferrer">
            Try it
          </a>
        </nav>
        <div
          aria-expanded={isActive ? "true" : "false"}
          aria-haspopup="true"
          aria-label={isActive ? "Fechar menu" : "Abrir menu"}
          className={isActive ? "menu active" : "menu"}
          onClick={() => {
            setActive(!isActive);
          }}
        ></div>
      </Router>
    </Container>
  );
}
