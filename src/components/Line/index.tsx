import { useMemo, useState } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";

import LineChart from "./LineChart";

interface LineState {
  valueArray: number[];
  maxXAxis: number;
  maxYAxis: number;
}

const Line = () => {
  const [state, setState] = useImmer<LineState>({
    valueArray: [10000, 20000, 60000],
    maxXAxis: 7,
    maxYAxis: 100000,
  });

  const [inputValues, setInputValues] = useState({
    valueArray: state.valueArray.join(", "),
    maxXAxis: `${state.maxXAxis}`,
    maxYAxis: `${state.maxYAxis}`,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newValueArray = inputValues.valueArray.split(",").map(Number);
    const newMaxXAxis = Number(inputValues.maxXAxis);
    const newMaxYAxis = Number(inputValues.maxYAxis);

    setState((draft) => {
      draft.valueArray = newValueArray;
      draft.maxXAxis = newMaxXAxis;
      draft.maxYAxis = newMaxYAxis;
    });
  };

  const renderLineChart = useMemo(
    () => (
      <LineChart
        valueArray={state.valueArray}
        maxXAxisValue={state.maxXAxis}
        maxYAxisValue={state.maxYAxis}
      />
    ),
    [state]
  );

  return (
    <Container>
      <SettingContainer onSubmit={handleSubmit}>
        <div>
          <SettingTitleText>Value Array</SettingTitleText>
          <SettingInput
            name="valueArray"
            value={inputValues.valueArray}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <SettingTitleText>maxXAxisValue</SettingTitleText>
          <SettingInput
            name="maxXAxis"
            value={inputValues.maxXAxis}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <SettingTitleText>maxYAxisValue</SettingTitleText>
          <SettingInput
            name="maxYAxis"
            value={inputValues.maxYAxis}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">SUBMIT</button>
      </SettingContainer>

      {renderLineChart}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const SettingContainer = styled.form`
  display: flex;
  flex-direction: row;
  gap: 0 30px;
  margin-bottom: 40px;
`;

const SettingTitleText = styled.p`
  font-size: 16px;
`;

const SettingInput = styled.input``;

export default Line;
