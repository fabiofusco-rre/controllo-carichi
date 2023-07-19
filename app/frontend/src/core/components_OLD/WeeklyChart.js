import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { setColorOpacity } from "../../helpers/util";



function WeeklyChart({dailySchedule, workModeConfig}) {

  let data = dailySchedule;

  const colorBarHandler = (entry) => {
    const currentHour = new Date().getHours();
    let opacity = 0.2;
    if (currentHour === +entry.hour) {
      opacity = 1;
    }

    const color = workModeConfig[entry.workMode].color
    return setColorOpacity(color, opacity);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis unit={" °C"} domain={[0, 30]}/>
        <Tooltip />
        <Bar dataKey="setPoint" radius={[5, 5, 0, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell
              cursor="pointer"
              fill={colorBarHandler(entry)}
              key={`cell-${index}`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default WeeklyChart;
