import React from "react";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

interface ProgressComponentProps {
  value: number;
  color: string;
}

const BorderLinearProgress = styled(LinearProgress)<{ color: string }>(
  ({ theme, color }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: color,
    },
  })
);

const ProgressComponent: React.FC<ProgressComponentProps> = ({
  value,
  color,
}) => {
  return (
    <BorderLinearProgress
      variant="determinate"
      value={value}
      style={{ "--progress-bar-color": color } as React.CSSProperties}
      color={"primary"}
    />
  );
};

export default ProgressComponent;
