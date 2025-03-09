
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", present: 85, absent: 15 },
  { name: "Tue", present: 88, absent: 12 },
  { name: "Wed", present: 92, absent: 8 },
  { name: "Thu", present: 90, absent: 10 },
  { name: "Fri", present: 82, absent: 18 },
];

const AttendanceChart = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
          barGap={0}
          barCategoryGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar dataKey="present" fill="#4ade80" radius={[4, 4, 0, 0]} />
          <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
