import { useCallback, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";

const DEFAULT_FILL_COLOR = "rgba(104, 204, 202, 0.3)";
const DEFAULT_STROKE_COLOR = "#16A5A5";
const DEFAULT_MAX_VALUE_COLOR = "#ff0000";

interface LineChartState {
  minValue: number;
  maxValue: number;
  stepX: number;
  stepY: number;
  horizontalLines: number[];
  chartValueArray: number[];
}

interface LineChartProps {
  valueArray: number[];
  maxXAxisValue: number;
  maxYAxisValue: number;
  width?: number;
  height?: number;
  paddingTop?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

const LineChart = (props: LineChartProps) => {
  const {
    valueArray,
    maxXAxisValue,
    maxYAxisValue,
    width = 500,
    height = 300,
    paddingTop = 20,
    paddingLeft = 20,
    paddingRight = 20,
  } = props;

  const [state, setState] = useState<LineChartState>({
    minValue: 0,
    maxValue: 100,
    stepX: 0,
    stepY: 0,
    horizontalLines: [],
    chartValueArray: [],
  });

  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(0);
  const { length } = useSpring({
    from: { length: 0 },
    to: { length: 1 },
    reset: true,
    config: { duration: 800 },
  });

  useEffect(() => {
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength();
      setPathLength(totalLength);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.chartValueArray]);

  const makeLineChart = useCallback(() => {
    const horizontalLines: number[] = [];
    const stepX = (width - (paddingLeft + paddingRight)) / maxXAxisValue;
    const stepY = (height - paddingTop) / (state.maxValue - state.minValue);

    const values = valueArray.map((item) =>
      item > 0 ? (item * 100) / maxYAxisValue : 0
    );

    const axisHStep = state.maxValue / 6;
    for (let i = 0; i <= 6; i++) {
      horizontalLines.push(axisHStep * i);
    }

    setState((prev) => ({
      ...prev,
      stepX,
      stepY,
      horizontalLines,
      chartValueArray: values,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueArray, maxXAxisValue, maxYAxisValue, width, height]);

  useEffect(() => {
    makeLineChart();
  }, [makeLineChart]);

  useEffect(() => {
    setPathLength(0);
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength();
      setPathLength(totalLength);
    }
  }, [valueArray, maxXAxisValue, maxYAxisValue]);

  const getPosition = (itemval: number, itemindex: number) => {
    const x = itemindex * state.stepX + paddingLeft;
    const y = -((itemval - state.minValue) * state.stepY);
    return { x, y };
  };

  const getChartPath = () => {
    return state.chartValueArray.reduce((path, number, index) => {
      const { x, y } = getPosition(Math.min(number, state.maxValue), index);
      return path + (index === 0 ? `M${paddingLeft},${y}` : ` L${x},${y}`);
    }, "");
  };

  const getChartPolygon = () => {
    const start = -(state.minValue * -1 * state.stepY);
    let path = `${paddingLeft},${start}`;

    state.chartValueArray.forEach((number: number, index: number) => {
      const { x, y } = getPosition(Math.min(number, state.maxValue), index);
      path += index === 0 ? ` ${paddingLeft},${y}` : ` ${x},${y}`;

      if (index === state.chartValueArray.length - 1) {
        path += ` ${
          (state.chartValueArray.length - 1) * state.stepX + paddingLeft + 2
        },${y}`;
      }
    });

    path += ` ${
      (state.chartValueArray.length - 1) * state.stepX + paddingLeft + 2
    },${start}`;
    path += ` ${paddingLeft},${start}`;

    return path;
  };

  const renderChartData = () => (
    <g>
      <animated.path
        ref={pathRef}
        d={getChartPath()}
        fill="none"
        stroke={DEFAULT_STROKE_COLOR}
        strokeWidth={2}
        strokeDasharray={pathLength}
        strokeDashoffset={length.to([0, 1], [pathLength, 0])}
      />
      <animated.polygon
        points={getChartPolygon()}
        fill={DEFAULT_FILL_COLOR}
        style={{
          opacity: length,
        }}
      />
    </g>
  );

  const renderChartPoint = () => (
    <>
      {state.chartValueArray.map((item, index) => {
        if (item === -1) return null;
        const position = getPosition(
          item > state.maxValue ? state.maxValue : item,
          index
        );
        return (
          <circle
            key={index}
            cx={position.x}
            cy={position.y}
            r={6}
            fill={
              item >= state.maxValue
                ? DEFAULT_MAX_VALUE_COLOR
                : DEFAULT_STROKE_COLOR
            }
          />
        );
      })}
    </>
  );

  const renderHorizontalLine = () => (
    <>
      {state.horizontalLines.map((item, index) => (
        <line
          key={index}
          x1={0}
          y1={-((item - state.minValue) * state.stepY)}
          x2={7 * state.stepX}
          y2={-((item - state.minValue) * state.stepY)}
          stroke={"#f2f2f2"}
          strokeWidth={1}
        />
      ))}
    </>
  );

  const renderVerticalLine = () => {
    const y = -((state.maxValue - state.minValue) * state.stepY);
    return (
      <>
        {[...Array(maxXAxisValue)].map((_, index) => (
          <line
            key={index}
            x1={index * state.stepX + paddingLeft}
            y1={0}
            x2={index * state.stepX + paddingLeft}
            y2={y}
            stroke={"#f2f2f2"}
            strokeWidth={1}
          />
        ))}
      </>
    );
  };

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(0, ${height})`}>
          {renderHorizontalLine()}
          {renderVerticalLine()}
          {renderChartData()}
          {renderChartPoint()}
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
