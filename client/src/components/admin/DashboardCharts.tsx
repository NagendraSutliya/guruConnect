import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const feeData = [
  { name: "Jan", expected: 100000, collected: 85000 },
  { name: "Feb", expected: 100000, collected: 90000 },
  { name: "Mar", expected: 100000, collected: 95000 },
  { name: "Apr", expected: 120000, collected: 80000 },
  { name: "May", expected: 120000, collected: 110000 },
  { name: "Jun", expected: 120000, collected: 115000 },
];

const studentStrengthData = [
  { name: "Primary (1-5)", value: 450, color: "#0E5A63" }, // primary
  { name: "Middle (6-8)", value: 350, color: "#E9B872" }, // gold
  { name: "High (9-12)", value: 200, color: "#5B8E90" },  // attendance.L
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ink backdrop-blur-md p-3 rounded-card shadow-lg animate-fadeIn">
        <p className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-xs font-semibold text-white">
              {entry.name === 'expected' ? 'Expected' : entry.name === 'collected' ? 'Collected' : entry.name}: <span className="text-surface-placeholder">
                {entry.name === 'expected' || entry.name === 'collected' ? '₹' : ''}
                {entry.value.toLocaleString()}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Fee Collection Bar Chart */}
      <div className="lg:col-span-8 bg-surface border border-line rounded-card-m p-6 shadow-sm">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-[16px] font-semibold text-ink tracking-tight">Fee Collection</h3>
            <p className="text-[11.5px] font-medium text-ink-secondary mt-1">Last 6 Months Analysis</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-line-input" />
              <span className="text-[11.5px] font-medium text-ink-secondary">Expected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
              <span className="text-[11.5px] font-medium text-ink-secondary">Collected</span>
            </div>
          </div>
        </div>
        
        <div className="w-full" style={{ height: 250 }}>
          <ResponsiveContainer width="99%" height={250}>
            <BarChart data={feeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E6E3" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4F5B57', fontFamily: 'IBM Plex Sans' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4F5B57', fontFamily: 'IBM Plex Sans' }} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip cursor={{ fill: '#F9FAF8' }} content={<CustomTooltip />} />
              <Bar dataKey="expected" fill="#DDE2DE" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="collected" fill="#0E5A63" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Strength Donut Chart */}
      <div className="lg:col-span-4 bg-surface border border-line rounded-card-m p-6 shadow-sm flex flex-col">
        <div className="mb-2">
          <h3 className="text-[16px] font-semibold text-ink tracking-tight">Student Strength</h3>
          <p className="text-[11.5px] font-medium text-ink-secondary mt-1">Total: 1,000</p>
        </div>
        
        <div className="w-full relative" style={{ height: 200 }}>
          <ResponsiveContainer width="99%" height={200}>
            <PieChart>
              <Pie
                data={studentStrengthData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {studentStrengthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
            <span className="text-[26px] font-semibold text-ink">1K</span>
            <span className="text-micro text-ink-secondary">Students</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-auto space-y-2">
          {studentStrengthData.map((item, i) => (
            <div key={i} className="flex justify-between items-center px-3 py-2 bg-surface-subtle border border-line rounded-control">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-small text-ink">{item.name}</span>
              </div>
              <span className="text-small font-semibold text-ink">{item.value} <span className="text-micro font-normal text-ink-secondary">({((item.value / 1000) * 100)}%)</span></span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
