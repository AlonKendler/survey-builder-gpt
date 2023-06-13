import { Typography } from "@mui/material";

import {
    PieChart as PieChartRechart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface PieChartProps {
    index: number;
    title: string;
    data: { name: string; value: number }[];
    colors: readonly string[];
}

const PieChart: React.FC<PieChartProps> = ({
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
                <PieChartRechart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill={colors[index % colors.length]}
                        label
                    >
                        {data.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChartRechart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart  