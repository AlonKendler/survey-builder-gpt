import { Typography } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  index: number;
  title: string;
  data: { name: string; value: number }[];
  colors: readonly string[];
}

const VerticalBarChart: React.FC<BarChartProps> = ({
  index,
  title,
  data,
  colors,
}) => {
  return (
    <div key={title}>
      <Typography variant="body1" ml={2} mt={2}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical" // Set the chart layout to vertical
          margin={{ top: 50, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide /> {/* Use type="number" and hide the XAxis */}
          <YAxis dataKey="name" type="category" /> {/* Use dataKey="name" and type="category" for YAxis */}
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="value" fill={colors[index % colors.length]}>
            <LabelList dataKey="value" position="right" /> {/* Position the label on the right side of the bars */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VerticalBarChart;
