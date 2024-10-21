import { Container } from "./styles";
import diagram from "../../assets/diagram.png";
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

export function Methodology() {
  return (
    <Container id="about">
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h3>Methodology</h3><br></br>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p>       
          The proposed fake news detection system consists of four key components: sentiment analysis, sarcasm detection, political bias evaluation, and text quality assessment. Each component functions as an isolated expert, fine-tuned on relevant annotated datasets. Transformer models such as BERT, ALBERT, RoBERTa, and DistilBERT are used to develop individual models for each expert, enhancing efficiency in detecting fake news.
          </p>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="fadeInLeft"
          delay={0.2 * 1000}
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <p>
          Supervised datasets are used to train models for each expert: sentiment analysis (categorized by tone), sarcasm detection (sarcastic vs. non-sarcastic), political bias evaluation (labeled with political bias), and text quality assessment (good vs. poor quality). After training, the performance of each model is evaluated using accuracy, precision, recall, and F1 score, and the best-performing model for each task is selected.
          </p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.3 * 1000}>
          <p>
          The outputs of the four experts are then combined using a mixture of experts model to yield a final decision on whether the news is fake. This integrated approach enhances the reliability of fake news detection by considering tone, sarcasm, political bias, and text quality in the final decision-making process.
          </p>
        </ScrollAnimation>
      </div>
      <div className="about-image">
        <ScrollAnimation animateIn="fadeInRight" delay={0.2 * 1000}>
          <img src={diagram} alt="LightHouse System" />
        </ScrollAnimation>
      </div>
    </Container>
  );
}
