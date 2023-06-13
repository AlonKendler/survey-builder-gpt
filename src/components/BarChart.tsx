import { Typography } from "@mui/material";
import React from "react";
import {
  BarChart as BarChartRechart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  index: number;
  title: string;
  data: { name: string; value: number }[];
  colors: readonly string[];

}

const BarChart: React.FC<BarChartProps> = ({ index, title, data, colors }) => {

  return (
    <div key={title}>
      <Typography variant="body1" ml={2} mt={2}>{title}</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChartRechart
          data={data}
          margin={{ top: 50, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="value" fill={colors[index % colors.length]}>
            <LabelList dataKey="value" position="top" />
          </Bar>
        </BarChartRechart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
