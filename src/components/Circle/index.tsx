import styled from "styled-components";
import { ColorResult, CompactPicker } from "react-color";
import { useImmer } from "use-immer";

import CircleProgress from "./CircleProgress";

interface Progress {
  radius: number;
  percent: number;
  strokeWidth: number;
  strokeColor: string;
  trackColor: string;
}

const Circle = () => {
  const [state, setState] = useImmer<Progress>({
    radius: 150,
    percent: 50,
    strokeWidth: 15,
    strokeColor: "#F2C94C",
    trackColor: "#f1f1f1",
  });

  const onChangeRadius = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    if (!target) return;

    setState((draft) => {
      draft.radius = Number(target.value);
    });
  };

  const onChangePercent = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    if (!target) return;

    setState((draft) => {
      draft.percent = Number(target.value);
    });
  };

  const handleStrokeColorChange = (color: ColorResult) => {
    setState((draft) => {
      draft.strokeColor = color.hex;
    });
  };

  const handleTrackColorChange = (color: ColorResult) => {
    setState((draft) => {
      draft.trackColor = color.hex;
    });
  };

  return (
    <Container>
      <SettingContainer>
        <RangeConatainer>
          <SettingTitleText>Radius: {state.radius}</SettingTitleText>
          <RangeInput
            type={"range"}
            min={30}
            max={200}
            step={1}
            defaultValue={state.radius}
            onChange={onChangeRadius}
          />
        </RangeConatainer>

        <RangeConatainer>
          <SettingTitleText>Percent: {state.percent}</SettingTitleText>
          <RangeInput
            type={"range"}
            min={1}
            max={100}
            step={1}
            defaultValue={state.percent}
            onChange={onChangePercent}
          />
        </RangeConatainer>

        <div>
          <SettingTitleText>Select Stroke Color</SettingTitleText>
          <CompactPicker
            color={state.strokeColor}
            onChangeComplete={handleStrokeColorChange}
          />
        </div>

        <div>
          <SettingTitleText>Select Track Color</SettingTitleText>
          <CompactPicker
            color={state.trackColor}
            onChangeComplete={handleTrackColorChange}
          />
        </div>
      </SettingContainer>

      <CircleProgress
        progress={state.percent / 100}
        radius={state.radius}
        strokeWidth={state.strokeWidth}
        strokeColor={state.strokeColor}
        trackColor={state.trackColor}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const SettingContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0 30px;
  margin-bottom: 20px;
`;

const SettingTitleText = styled.p`
  font-size: 18px;
`;

const RangeConatainer = styled.div`
  flex-direction: column;
`;

const RangeInput = styled.input`
  width: 200px;
  accent-color: #808080;
`;

export default Circle;
