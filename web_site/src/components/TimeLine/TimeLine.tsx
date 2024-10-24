import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "rc-vertical-timeline";
import "rc-vertical-timeline/build/rc-vertical-timeline.min.css";
import {
  AiFillStar,
  AiOutlineProject,
  AiOutlineFileText,
  AiOutlinePartition,
  AiOutlineCheckCircle,
  AiOutlineSchedule,
} from "react-icons/ai";

const Timeline: React.FC = () => {
  return (
    <div id="timeline">
      <h2 style={{ textAlign: "center", fontSize: "4rem", marginBottom: "3rem", marginTop: "5rem" }}>Timeline</h2>
      <VerticalTimeline>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#2b2b2b", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
          date="March 2024"
          iconStyle={{ background: "var(--orange)", color: "#fff" }}
          icon={<AiOutlineProject />} // Icon for project proposal
        >
          <h3 className="vertical-timeline-element-title">Project Proposal</h3><br></br>
          <p>
            A Project Proposal is presented to potential sponsors or clients to
            receive funding or get the project approved.
          </p><br></br>
          <p>Marks Allocated: 6%</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="June 2024"
          iconStyle={{ background: "var(--orange)", color: "#fff" }}
          contentStyle={{ background: "#2b2b2b", color: "#fff" }}
          icon={<AiOutlinePartition />} // Icon for progress presentation
        >
          <h3 className="vertical-timeline-element-title">
            Progress Presentation I
          </h3><br></br>
          <p>
            Reviews the 50% completion status of the project and reveals any gaps
            or inconsistencies in the design/requirements.
          </p><br></br>
          <p>Marks Allocated: 6%</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="July 2024"
          iconStyle={{ background: "var(--orange)", color: "#fff" }}
          contentStyle={{ background: "#2b2b2b", color: "#fff" }}
          icon={<AiOutlineFileText />} // Icon for research paper
        >
          <h3 className="vertical-timeline-element-title">Research Paper</h3><br></br>
          <p>
            Describes your contribution to existing knowledge, giving recognition
            to all referenced work.
          </p><br></br>
          <p>Marks Allocated: 10%</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="September 2024"
          iconStyle={{ background: "var(--orange)", color: "#fff" }}
          contentStyle={{ background: "#2b2b2b", color: "#fff" }}
          icon={<AiOutlinePartition />} // Icon for progress presentation II
        >
          <h3 className="vertical-timeline-element-title">
            Progress Presentation II
          </h3><br></br>
          <p>
            Reviews the 90% completion status of the project, along with a Poster
            presentation describing the project as a whole.
          </p><br></br>
          <p>Marks Allocated: 18%</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="October 2024"
          iconStyle={{ background: "var(--orange)", color: "#fff" }}
          contentStyle={{ background: "#2b2b2b", color: "#fff" }}
          icon={<AiOutlineCheckCircle />} // Icon for website assessment
        >
          <h3 className="vertical-timeline-element-title">Website Assessment</h3><br></br>
          <p>
            The website promotes the research project and reveals all details
            related to the project.
          </p><br></br>
          <p>Marks Allocated: 2%</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="November 2024"
          iconStyle={{ background: "var(--orange)", color: "#fff" }}
          contentStyle={{ background: "#2b2b2b", color: "#fff" }}
          icon={<AiOutlineSchedule />} // Icon for logbook
        >
          <h3 className="vertical-timeline-element-title">Logbook</h3><br></br>
          <p>
            The status of the project is validated through the Logbook, including
            Status documents 1 & 2.
          </p><br></br>
          <p>Marks Allocated: 3%</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="November 2024"
          iconStyle={{ background: "var(--orange)", color: "#fff" }}
          contentStyle={{ background: "#2b2b2b", color: "#fff" }}
          icon={<AiOutlineFileText />} // Icon for final report
        >
          <h3 className="vertical-timeline-element-title">Final Report</h3><br></br>
          <p>
            The Final Report evaluates the completed project, including individual
            and group reports.
          </p><br></br>
          <p>Marks Allocated: 19%</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="November 2024"
          iconStyle={{ background: "var(--orange)", color: "#fff" }}
          contentStyle={{ background: "#2b2b2b", color: "#fff" }}
          icon={<AiFillStar />} // Icon for final presentation & viva
        >
          <h3 className="vertical-timeline-element-title">
            Final Presentation & Viva
          </h3><br></br>
          <p>
            Viva is held individually to assess each member's contribution to the
            project.
          </p><br></br>
          <p>Marks Allocated: 20%</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
          icon={<AiFillStar />} // Final icon
        />
      </VerticalTimeline>
    </div>
  );
};

export default Timeline;
