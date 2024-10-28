import { Container } from "./styles";
import githubIcon from "../../assets/github.svg"
import dinuka from '../../assets/dinuka.png'
import tharindu from '../../assets/tharindu.png'
import disira from '../../assets/disira.png'
import sansika from '../../assets/sansika.png'
import harinda from '../../assets/harinda.jpg'
import samitha from '../../assets/samitha.png'
import archchana from '../../assets/archchana.png'
import pubudu from '../../assets/pubudu.jpg'
import poojani from "../../assets/poojani.jpg"
import ScrollAnimation from "react-animate-on-scroll";
import linkedin from '../../assets/linkedin.svg';
import emailIcon from "../../assets/email-icon.svg";

export function Team() {
  return (
    <Container id="team">
      <h2>Meet Our Team</h2>
      <div className="projects">

        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={dinuka} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/dinuka-dissanayake/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a
                  href="https://github.com/it21024818"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={githubIcon} alt="GitHub" />
                </a>
                <a href="mailto:it21024818@my.sliit.lk"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Dinuka Dissanayake</h3>
              <h4>Undergraduate</h4>
              <p>Sri Lanka Institute of Information Technology</p>
              <h4>Department</h4>
              <p>Software Engineering</p>
            </div>
            <footer> <ul className="tech-list"> <li>Group Leader</li> </ul> </footer>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={tharindu} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/tharindu-gunasekera/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a
                  href="https://github.com/it21058578"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={githubIcon} alt="GitHub" />
                </a>
                <a href="mailto:it21058578@my.sliit.lk"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Tharindu Gunasekara</h3>
              <h4>Undergraduate</h4>
              <p>Sri Lanka Institute of Information Technology</p>
              <h4>Department</h4>
              <p>Software Engineering</p>
            </div>
            <footer> <ul className="tech-list"> <li>Group Member</li> </ul> </footer>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={disira} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/disira-thihan-53a966217/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a
                  href="https://github.com/it21070358"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={githubIcon} alt="GitHub" />
                </a>
                <a href="mailto:it21070358@my.sliit.lk"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Disira Thihan</h3>
              <h4>Undergraduate</h4>
              <p>Sri Lanka Institute of Information Technology</p>
              <h4>Department</h4>
              <p>Software Engineering</p>
            </div>
            <footer> <ul className="tech-list"> <li>Group Member</li> </ul> </footer>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={sansika} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/sansika-kodithuwakku/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a
                  href="https://github.com/it21028014 "
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={githubIcon} alt="GitHub" />
                </a>
                <a href="mailto:it21028014@my.sliit.lk"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Sansika Kodithuwakku</h3>
              <h4>Undergraduate</h4>
              <p>Sri Lanka Institute of Information Technology</p>
              <h4>Department</h4>
              <p>Software Engineering</p>
            </div>
            <footer> <ul className="tech-list"> <li>Group Member</li> </ul> </footer>
          </div>
        </ScrollAnimation>
      </div>
      <h2 style={{ marginTop: "5rem" }}>Supervising Team</h2>
      <div className="teams">
        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={harinda} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/harinda-fernando-7655bb67/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a href="mailto:harinda.f@sliit.lk"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Dr. Harinda Fernando</h3>
              <h4>Assistant Professor</h4>
              <p>Sri Lanka Institute of Information Technology</p>
              <h4>Department</h4>
              <p>Computer Systems Engineering</p>
            </div>
            <footer> <ul className="tech-list"> <li>Supervisor</li> </ul> </footer>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={samitha} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/samitha-vidhana-arachchi/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a href="mailto:samithapva@gmail.com"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Samitha Vidhanaarachchi</h3>
              <h4>Senior Lecturer</h4>
              <p>Sri Lanka Institute of Information Technology</p>
              <h4>Department</h4>
              <p>Software Engineering</p>
            </div>
            <footer> <ul className="tech-list"> <li>Co-Supervisor</li> </ul> </footer>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={archchana} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/archchana-sindhujan-b21b2b10b/?originalSubdomain=uk"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a href="mailto:as04746@surrey.ac.uk"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Archchana Sindhujan</h3>
              <h4>PHD Student</h4>
              <p>University of Surrey</p>
              <h4>Department</h4>
              <p>Computer Science and Electronic Engineering</p>
            </div>
            <footer> <ul className="tech-list"> <li>External Supervisor</li> </ul> </footer>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={poojani} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/malmaleesha-gunathilake-55b023236/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a href="mailto:poojani.g@sliit.lk"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Poojani Gunathilake</h3>
              <h4>Assistant Lecturer</h4>
              <p>Sri Lanka Institute of Information Technology</p>
              <h4>Department</h4>
              <p>Software Engineering</p>
            </div>
            <footer> <ul className="tech-list"> <li>Co-Supervisor</li> </ul> </footer>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animateIn="flipInX">
          <div className="project">
            <img src={pubudu} style={{ width: "100%", borderRadius: "1.2rem", marginBottom: "1rem" }} alt="Dinuka" />
            <header>
              <div className="social-media" >
                <a
                  href="https://www.linkedin.com/in/pubuduwanigasekara/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedin} alt="Linkedin" />
                </a>
                <a href="mailto:pubudu0098@gmail.com"><img src={emailIcon} alt="Email"/></a> 
              </div>
            </header>
            <div className="body">
              <h3>Pubudu Wanigasekara</h3>
              <h4>Software Engineer</h4>
              <p>iVedha Inc.</p>
            </div>
            <footer> <ul className="tech-list"> <li>External Supervisor</li> </ul> </footer>
          </div>
        </ScrollAnimation>
      </div>
    </Container>
  );
}