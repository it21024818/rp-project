import { Container } from "./styles";
import emailIcon from "../../assets/email-icon.svg";
import phoneIcon from "../../assets/phone-icon.svg"
import { Form } from "../Form/Form";


export function Contact(){

  return(
    <Container id="contact">
      <header>
        <h2>Contact</h2>
        <p>Need any information regarding our research? </p>
        <p>Contact us now for any support </p>
      </header>
      <div className="contacts">
        <div>
        <a href="mailto:info.detect.lighthouse@gmail.com"><img src={emailIcon} alt="Email" /></a> 
          <a href="mailto:info.detect.lighthouse@gmail.com">info.detect.lighthouse@gmail.com</a>
        </div>
        <div>
        <a href="tel:+94771196888"><img src={phoneIcon} alt="Phone No" /></a>
          <a href="tel:+94771196888">(+94) 771196888</a>
        </div>  
      </div>
      <Form></Form>
    </Container>
  )
}