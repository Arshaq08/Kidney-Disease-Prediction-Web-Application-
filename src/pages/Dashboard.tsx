import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, Users, Activity, FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RPieChart, Pie, Cell,
  LineChart, Line, Legend
} from "recharts";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const accuracyData = [
  { model: "Random Forest", accuracy: 97, precision: 97, recall: 97 },
  { model: "XGBoost", accuracy: 89, precision: 90, recall: 89 },
  { model: "Logistic Reg.", accuracy: 30, precision: 30, recall: 30 },
];

// CKD Distribution (you can keep or adjust)
const ckdDistribution = [
  { name: "CKD Positive", value: 250, color: "hsl(340 75% 55%)" },
  { name: "CKD Negative", value: 150, color: "hsl(168 80% 45%)" },
];

// Trend Data (static is fine for demo)
const trendData = [
  { month: "Jan", predictions: 120, ckdDetected: 45 },
  { month: "Feb", predictions: 180, ckdDetected: 62 },
  { month: "Mar", predictions: 250, ckdDetected: 88 },
  { month: "Apr", predictions: 310, ckdDetected: 105 },
  { month: "May", predictions: 420, ckdDetected: 140 },
  { month: "Jun", predictions: 530, ckdDetected: 175 },
];

// ✅ FIXED STATS
const stats = [
  { icon: <Users className="w-5 h-5" />, label: "Total Predictions", value: "1,810" },
  { icon: <Activity className="w-5 h-5" />, label: "CKD Detected", value: "615" },
  { icon: <TrendingUp className="w-5 h-5" />, label: "Best Accuracy", value: "97%" },
  { icon: <FileText className="w-5 h-5" />, label: "Features Used", value: "24" },
];

const Dashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Analytics <span className="glow-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Model performance metrics and prediction analytics.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="glass-card p-5 text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
                {s.icon}
              </div>
              <p className="stat-number text-2xl mb-1">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Model Comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-semibold">Model Comparison</h2>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(195 20% 15%)" />
                <XAxis dataKey="model" tick={{ fill: "hsl(195 15% 55%)", fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(195 15% 55%)", fontSize: 12 }} />
                <Tooltip />
                <Legend />

                <Bar dataKey="accuracy" fill="hsl(168 80% 45%)" />
                <Bar dataKey="precision" fill="hsl(168 60% 35%)" />
                <Bar dataKey="recall" fill="hsl(195 30% 30%)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* CKD Distribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-semibold">CKD Distribution</h2>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <RPieChart>
                <Pie
                  data={ckdDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {ckdDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RPieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Trend Graph */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-semibold">Prediction Trends</h2>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(195 20% 15%)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line type="monotone" dataKey="predictions" stroke="hsl(168 80% 45%)" />
              <Line type="monotone" dataKey="ckdDetected" stroke="hsl(340 75% 55%)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
    </div>

    <Footer />
  </div>
);

export default Dashboard;
