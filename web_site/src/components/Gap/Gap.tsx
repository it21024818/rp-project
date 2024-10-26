import { Container } from "./styles";
import sentiment from "../../assets/sentiment.png";
import sarcasm from "../../assets/sarcasm.png";
import bias from "../../assets/bias.png";
import quality from "../../assets/quality.png";
import python from "../../assets/python.png";
import tensorflow from "../../assets/tensorflow.png";
import htmlIcon from "../../assets/html-icon.svg";
import cssIcon from "../../assets/css-icon.svg";
import jsIcon from "../../assets/js-icon.svg";
import nodeIcon from "../../assets/node-icon.svg";
import reactIcon from "../../assets/react-icon.svg";
import typescriptIcon from "../../assets/typescript-icon.svg";
import mongodb from "../../assets/mongodb.svg";
import boostrapIcon from "../../assets/bootstrap-icon.svg";
import ScrollAnimation from "react-animate-on-scroll";
import Jenkins from "../../assets/Jenkins.png";
import docker from "../../assets/docker.png";
import colab from "../../assets/colab.png";
import gcp from "../../assets/gcp.png";
import stripe from "../../assets/stripe.png";

export function Gap() {
  return (
    <Container id="about">
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h3>Research Gap</h3><br></br>
        </ScrollAnimation>
        <div className="about-image">
          <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
            <img src={sentiment} alt="LightHouse System" />
          </ScrollAnimation>
        </div> 
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p style={{ color: "var(--orange)", fontWeight: "bold" }}>Tone and Fake News Spread</p><br></br>
          <p>       
          While significant work exists on fake news content, the role of tone aggressive, neutral, or empathetic in influencing audience reception and trust is underexplored. Current studies largely ignore how tone may impact fake news dissemination.
          </p>
        </ScrollAnimation>
      </div>
      <div className="about-text" style={{ marginTop: "7rem" }}>
        <div className="about-image">
          <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
            <img src={sarcasm} alt="LightHouse System" />
          </ScrollAnimation>
        </div> 
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p style={{ color: "var(--orange)", fontWeight: "bold" }}>Sarcasm and Fake News Detection</p><br></br>
          <p>       
          Sarcasm remains a challenge for fake news detection systems. Although it disrupts literal meaning, its role in manipulating readers is poorly studied. More research is needed to explore sarcasm as a potential indicator of fake news.
          </p>
        </ScrollAnimation>
      </div>
      <div className="about-text" style={{ marginTop: "7rem" }}>
        <div className="about-image">
          <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
            <img src={bias} alt="LightHouse System" />
          </ScrollAnimation>
        </div> 
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p style={{ color: "var(--orange)", fontWeight: "bold" }}>Political Bias and Fake News Correlation</p><br></br>
          <p>       
          There is limited research on the relationship between political bias and the spread of fake news. Few studies investigate how increasing bias correlates with the credibility and sharing of fake news.
          </p>
        </ScrollAnimation>
      </div>
      <div className="about-text" style={{ marginTop: "7rem" }}>
        <div className="about-image">
          <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
            <img src={quality} alt="LightHouse System" />
          </ScrollAnimation>
        </div> 
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p style={{ color: "var(--orange)", fontWeight: "bold" }}>Text Quality and Fake News Perception</p><br></br>
          <p>       
          The connection between the quality of text grammar, structure, and cohesion and news credibility is underexplored. Research is needed on how well-written content influences the audience’s perception and spread of fake news.
          </p>
        </ScrollAnimation>
      </div>
    </Container>
  );
}
