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
    <VerticalTimeline>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
        date="March 2024"
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<AiOutlineProject />} // Icon for project proposal
      >
        <h3 className="vertical-timeline-element-title">Project Proposal</h3>
        <p>
          A Project Proposal is presented to potential sponsors or clients to
          receive funding or get the project approved.
        </p>
        <p>Marks Allocated: 6%</p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="June 2024"
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<AiOutlinePartition />} // Icon for progress presentation
      >
        <h3 className="vertical-timeline-element-title">
          Progress Presentation I
        </h3>
        <p>
          Reviews the 50% completion status of the project and reveals any gaps
          or inconsistencies in the design/requirements.
        </p>
        <p>Marks Allocated: 6%</p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="July 2024"
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<AiOutlineFileText />} // Icon for research paper
      >
        <h3 className="vertical-timeline-element-title">Research Paper</h3>
        <p>
          Describes your contribution to existing knowledge, giving recognition
          to all referenced work.
        </p>
        <p>Marks Allocated: 10%</p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="September 2024"
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<AiOutlinePartition />} // Icon for progress presentation II
      >
        <h3 className="vertical-timeline-element-title">
          Progress Presentation II
        </h3>
        <p>
          Reviews the 90% completion status of the project, along with a Poster
          presentation describing the project as a whole.
        </p>
        <p>Marks Allocated: 18%</p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="October 2024"
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<AiOutlineCheckCircle />} // Icon for website assessment
      >
        <h3 className="vertical-timeline-element-title">Website Assessment</h3>
        <p>
          The website promotes the research project and reveals all details
          related to the project.
        </p>
        <p>Marks Allocated: 2%</p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="November 2024"
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<AiOutlineSchedule />} // Icon for logbook
      >
        <h3 className="vertical-timeline-element-title">Logbook</h3>
        <p>
          The status of the project is validated through the Logbook, including
          Status documents 1 & 2.
        </p>
        <p>Marks Allocated: 3%</p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="November 2024"
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<AiOutlineFileText />} // Icon for final report
      >
        <h3 className="vertical-timeline-element-title">Final Report</h3>
        <p>
          The Final Report evaluates the completed project, including individual
          and group reports.
        </p>
        <p>Marks Allocated: 19%</p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="November 2024"
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<AiFillStar />} // Icon for final presentation & viva
      >
        <h3 className="vertical-timeline-element-title">
          Final Presentation & Viva
        </h3>
        <p>
          Viva is held individually to assess each member's contribution to the
          project.
        </p>
        <p>Marks Allocated: 20%</p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
        icon={<AiFillStar />} // Final icon
      />
    </VerticalTimeline>
  );
};

export default Timeline;
