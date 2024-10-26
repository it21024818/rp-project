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

export function Objectives() {
  return (
    <Container id="about">
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h3>Research Objectives</h3><br></br>
        </ScrollAnimation>
        <div className="about-image">
          {/* <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
            <img src={sentiment} alt="LightHouse System" />
          </ScrollAnimation> */}
        </div> 
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p style={{ color: "var(--orange)", fontWeight: "bold"  }}>Role of Tone in Fake News Spread</p><br></br>
          <p>       
          Assess the impact of different tones (aggressive, neutral, empathetic) on the dissemination of fake news by developing a model to enhance fake news detection systems.
          </p>
        </ScrollAnimation>
      </div>
      <div className="about-text" style={{ marginTop: "7rem" }}>
        <div className="about-image">
          {/* <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
            <img src={sarcasm} alt="LightHouse System" />
          </ScrollAnimation> */}
        </div> 
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p style={{ color: "var(--orange)", fontWeight: "bold"  }}>Sarcasm in Fake News Detection</p><br></br>
          <p>       
          Investigate sarcasm as an indicator of fake news by incorporating a sarcasm detection module using natural language processing to improve fake news identification.
          </p>
        </ScrollAnimation>
      </div>
      <div className="about-text" style={{ marginTop: "7rem" }}>
        <div className="about-image">
          {/* <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
            <img src={bias} alt="LightHouse System" />
          </ScrollAnimation> */}
        </div> 
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p style={{ color: "var(--orange)", fontWeight: "bold"  }}>Political Bias and Fake News Sharing</p><br></br>
          <p>       
          Analyze the relationship between political bias and the spread of fake news by creating a model to assess bias in news articles and its role in fake news dissemination.
          </p>
        </ScrollAnimation>
      </div>
      <div className="about-text" style={{ marginTop: "7rem" }}>
        <div className="about-image">
          {/* <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
            <img src={quality} alt="LightHouse System" />
          </ScrollAnimation> */}
        </div> 
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p style={{ color: "var(--orange)", fontWeight: "bold"  }}>Text Quality and Fake News Perception</p><br></br>
          <p>       
          Examine how text quality (grammar, readability) influences the perception and sharing of fake news, identifying methods to assess how well-written articles affect their credibility and spread.
          </p>
        </ScrollAnimation>
      </div>
    </Container>
  );
}
