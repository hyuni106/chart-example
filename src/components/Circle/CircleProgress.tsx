import { animated, useSpring } from "react-spring";

const PROGRESS_MIN_PERCENTAGE = 0;
const PROGRESS_MAX_PERCENTAGE = 1;

interface CircleProgressProps {
  progress: number;
  radius: number;
  strokeWidth: number;
  strokeColor: string;
  trackColor: string;
}

const CircleProgress = (props: CircleProgressProps) => {
  const { progress, radius, strokeWidth, strokeColor, trackColor } = props;

  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(
    Math.max(progress, PROGRESS_MIN_PERCENTAGE),
    PROGRESS_MAX_PERCENTAGE
  );
  const { animatedValue } = useSpring({
    animatedValue: clampedProgress,
    config: { duration: 800 },
  });

  return (
    <div>
      <svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
        <g
          transform={`translate(${radius + strokeWidth / 2}, ${
            radius + strokeWidth / 2
          })`}
        >
          <circle
            r={radius}
            fill={"#ffffff"}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <animated.path
            fill={"transparent"}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={animatedValue.to((v) => circumference * (1 - v))}
            d={`M0,-${radius} A${radius},${radius} 0 1,0 0,${radius} A${radius},${radius} 0 1,0 0,-${radius}`}
          />
        </g>
      </svg>
    </div>
  );
};

export default CircleProgress;
