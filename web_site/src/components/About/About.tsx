import { Container } from "./styles";
import LightHouseImage from "../../assets/lighthouse.png";
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

export function About() {
  return (
    <Container id="about">
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h2>Project Scope</h2>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p>
            Welcome to LightHouse, the Fake News Detection System created by
            RP-GRP22. Our mission is to help combat the spread of misinformation
            using cutting-edge machine learning and artificial intelligence
            technologies.
          </p>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="fadeInLeft"
          delay={0.2 * 1000}
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <p>
            With a comprehensive approach to detecting and analyzing fake news,
            we utilize advanced models like BERT, ALBERT, RoBERTa, and
            DistilBERT to classify news articles, leveraging sentiment analysis,
            sarcasm detection, and political bias assessments to provide the
            most accurate predictions.
          </p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.3 * 1000}>
          <p>
            Whether you're a media outlet, a research organization, or an
            individual concerned about fake news, LightHouse can help you
            navigate the vast ocean of online content and distinguish the facts
            from fiction.
          </p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.4 * 1000}>
          <h3>Key Technologies and Tools:</h3>
        </ScrollAnimation>
        <div className="hard-skills">
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={python} alt="python" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={reactIcon} alt="React" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={mongodb} alt="mongodb" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={tensorflow} alt="tensorflow" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={gcp} alt="gcp" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={Jenkins} alt="Jenkins" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={stripe} alt="stripe" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={docker} alt="docker" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.1 * 1000}>
              <img src={colab} alt="colab" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.12 * 1000}>
              <img src={typescriptIcon} alt="Typescript" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.13 * 1000}>
              <img src={nodeIcon} alt="Node.js" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.14 * 1000}>
              <img src={htmlIcon} alt="HTML" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.15 * 1000}>
              <img src={cssIcon} alt="CSS" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.16 * 1000}>
              <img src={boostrapIcon} alt="Bootstrap" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.17 * 1000}>
              <img src={jsIcon} alt="JavaScript" />
            </ScrollAnimation>
          </div>
          {/* <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.18 * 1000}>
              <img src={vueIcon} alt="Vue.js" />
            </ScrollAnimation>
          </div> */}
        </div>
      </div>
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h3>Literature Review</h3><br></br>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p>       
            The digital age has introduced significant challenges in the spread of information, with misinformation becoming a prominent issue, particularly in political events and the COVID-19 pandemic. Misinformation, which involves the spread of false or misleading information presented as news, has undermined public confidence in institutions, distorted communication, and influenced societal processes. Traditional media, central to maintaining social stability, has been weakened by the surge of fake news on social media platforms, leading to polarization and eroding cultural memory.
          </p>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="fadeInLeft"
          delay={0.2 * 1000}
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <p>
          A key example of misinformation's impact was during the 2016 U.S. Presidential Election, where fake news heavily influenced public opinion. Facebook CEO Mark Zuckerberg acknowledged underestimating the role of fake news, highlighting the responsibility of social media platforms in shaping political discourse and preventing the spread of misinformation. The election showcased how easily social media can be used to manipulate political outcomes.
          </p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.3 * 1000}>
          <p>
          The spread of fake news during the COVID-19 pandemic further demonstrated its harmful effects, as it hampered global health efforts. Many people disregarded public health advice due to a lack of trust in credible sources, largely driven by misinformation circulating online. This erosion of trust significantly undermined efforts to contain the virus and exposed the broader dangers of fake news during crises.
          </p>
        </ScrollAnimation>
      </div>
      {/* <div className="about-image">
        <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
          <img src={LightHouseImage} alt="LightHouse System" />
        </ScrollAnimation>
      </div> */}
    </Container>
  );
}
