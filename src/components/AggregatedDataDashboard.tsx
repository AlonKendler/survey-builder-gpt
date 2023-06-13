import React from "react";
import { schemeCategory10 } from "d3-scale-chromatic";
import BarChart from "./BarChart";
import { Card } from "@mui/material";
import PieChart from "./PieChart";
import VerticalBarChart from "./VerticalBarChart";
import RowList from "./RowList";

const colors = schemeCategory10;
interface AggregatedDataDashboardProps {
  data: { [key: string]: { [key: string]: number } };
  variant?: "bar" | "pie" | "vertical" | "list";
}

function convertToCamelCaseWithSpaces(camelCaseString: string) {
  // Use a regular expression to insert spaces before capital letters
  const stringWithSpaces = camelCaseString.replace(/([A-Z])/g, " $1");

  // Convert the string to lowercase and remove leading/trailing spaces
  const camelCaseWithSpaces = stringWithSpaces.toLowerCase().trim();

  return camelCaseWithSpaces;
}

const AggregatedDataDashboard: React.FC<AggregatedDataDashboardProps> = ({
  data,
}) => {
  const chartData: { [key: string]: { name: string; value: number }[] } = {};
  Object.keys(data).forEach((key) => {
    chartData[key] = Object.entries(data[key]).map(([name, value]) => ({
      name,
      value,
    }));
  });

  console.log("charData in aggragated dashboard", chartData);
  return (
    <>
      {Object.keys(chartData)
        .filter((key) => chartData[key].length > 2)
        .map((key, index) => {
          const parsedTitle = convertToCamelCaseWithSpaces(key);
          console.log("key", chartData[key]);

          // Calculation for what chart to render.
          const dataByKey = chartData[key];
          const totalKeys = dataByKey.length;
          const sumOfValues = dataByKey.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.value;
          }, 0);
          const avg = sumOfValues / totalKeys;

          return (
            <Card sx={{ marginTop: 2.5 }} key={key}>
              {avg >= 0.8 && avg < 1.5 ? (
                <RowList
                  list={chartData[key]}
                  title={parsedTitle}
                  label={key}
                />
              ) : totalKeys > 5 ? (
                <PieChart
                  title={parsedTitle}
                  index={index}
                  data={chartData[key]}
                  colors={colors}
                />
              ) : (
                <VerticalBarChart
                  title={parsedTitle}
                  index={index}
                  data={chartData[key]}
                  colors={colors}
                />
              )}
            </Card>
          );
        })}
    </>
  );
};

export default AggregatedDataDashboard;
