import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Heart, ArrowLeft, Activity } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { RISK_COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Result = () => {
  const { result } = useApp();
  const navigate = useNavigate();

  // Color based on risk level
  const riskColor = RISK_COLORS[result?.risk_level] ?? "hsl(var(--primary))";

  // Dynamic score color (optional enhancement)
  const getScoreColor = (score: number) => {
    if (score < 20) return "#22c55e"; // green
    if (score < 40) return "#eab308"; // yellow
    if (score < 70) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-heading font-bold mb-3">No Results Yet</h2>
          <p className="text-muted-foreground mb-8">
            You need to complete the prediction form first.
          </p>
          <Button onClick={() => navigate("/predict")} size="lg">
            <Activity className="w-4 h-4 mr-2" /> Go to Prediction
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const sections = [
    { icon: <AlertTriangle className="w-5 h-5" />, label: "Possible Causes", items: result.causes },
    { icon: <Heart className="w-5 h-5" />, label: "Recommendations", items: result.recommendations },
    { icon: <ShieldCheck className="w-5 h-5" />, label: "Prevention Tips", items: result.prevention },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

            {/* BACK BUTTON */}
            <Button variant="ghost" onClick={() => navigate("/predict")} className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {/* RESULT CARD */}
            <div className="glass-card p-8 mb-8 text-center">

              <h1 className="text-3xl font-heading font-bold mb-6">
                Prediction Result
              </h1>

              {/* YES / NO */}
              <div
                className="inline-flex px-6 py-3 rounded-full text-lg font-bold mb-4"
                style={{ background: riskColor, color: "#fff" }}
              >
                {result.ckd_detected === "Yes"
                  ? "CKD Detected!"
                  : "No CKD"}
              </div>

              {/* RISK LEVEL */}
              <div className="text-xl font-semibold mb-4">
                Risk Level:{" "}
                <span className="text-primary">{result.risk_level}</span>
              </div>

              {/* 🔥 RISK SCORE BAR */}
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">Risk Score</p>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${result.risk_score}%`,
                      background: getScoreColor(result.risk_score),
                    }}
                  />
                </div>

                <p className="mt-2 text-lg font-bold text-primary">
                  {result.risk_score} / 100
                </p>
              </div>

            </div>

            {/* DETAILS */}
            <div className="space-y-6">
              {sections.map(({ icon, label, items }) =>
                items?.length ? (
                  <div key={label} className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {icon}
                      <h3 className="font-semibold">{label}</h3>
                    </div>

                    <ul className="space-y-2">
                      {items.map((item: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center mt-10 gap-4">
              <Button onClick={() => navigate("/predict")} variant="outline">
                New Prediction
              </Button>

              <Button onClick={() => navigate("/dashboard")}>
                View Dashboard
              </Button>
            </div>

          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Result;
