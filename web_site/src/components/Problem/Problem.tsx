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

export function Problem() {
  return (
    <Container id="about">
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h3>Research Problem</h3><br></br>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p>
          Fake news is a current phenomenon that has gained much traction especially in the recent past and has effects on the society and the society’s beliefs. Despite existing efforts to detect and mitigate the spread of false information, current approaches often fail to address several key aspects: The following specific research questions are proposed in the study how the tone of text segments contributes to the spread of fake news, the role of sarcasm in identifying fake news, the correlation between increasing political bias and fake news dissemination, and the effect of text quality on the perception of news credibility.
          </p>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="fadeInLeft"
          delay={0.2 * 1000}
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <p>
          The four dimensions listed above are either not considered or not well incorporated in the current fake news detection models due to which the efficiency of identifying and preventing fake news is quite low.
          </p>
        </ScrollAnimation>
      </div>
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h3>Proposed Solution</h3><br></br>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p>       
          To effectively address these gaps, we propose the development of an integrated system that combines expert analysis from each of these four areas: This work focuses on sentiment analysis, sarcasm identification, political leaning determination and text quality assessment. This framework known as the “Mixture of Experts” would factor in these dimensions by utilizing state of the art machine learning algorithms for each of them and combining the results. 
          </p>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="fadeInLeft"
          delay={0.2 * 1000}
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <p>
          With the different modules that are each dedicated to one aspect of the detection process and their output being put into a central decision maker, the system would be able to better identify fake news and do it in a much more efficient manner than current systems. This approach is useful to consider not only the content but also other textual features that are most likely to drive the disinformation spread.
          </p>
        </ScrollAnimation>
      </div>
    </Container>
  );
}
