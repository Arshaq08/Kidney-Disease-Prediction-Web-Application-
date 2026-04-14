import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Send, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FIELD_LABELS, initialForm } from "@/constants/fields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportUpload from "@/components/ReportUpload";

const categoricalFields = [
  "rbc", "pc", "pcc", "ba",
  "htn", "dm", "cad", "appet", "pe", "ane"
];

const Prediction = () => {
  const [formData, setFormData] = useState<Record<string, string>>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setResult } = useApp();

  // ✅ Better typing
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload: Record<string, any> = {};

    for (const key in formData) {
      let val = formData[key];

      if (categoricalFields.includes(key)) {
        if (!val) {
          // ✅ FIXED
          setError(`Please select value for ${FIELD_LABELS[key]}`);
          setIsSubmitting(false);
          return;
        }
        payload[key] = val.toLowerCase();
      } else {
        const num = parseFloat(val);
        if (isNaN(num)) {
          // ✅ FIXED
          setError(`Invalid value for ${FIELD_LABELS[key]}`);
          setIsSubmitting(false);
          return;
        }
        payload[key] = num;
      }
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Prediction failed");
        return;
      }

      setResult(data);
      navigate("/result");

    } catch {
      setError("Cannot connect to backend. Make sure Flask is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border mb-6">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">CKD Prediction</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Enter Medical Details
            </h1>

            <p className="text-muted-foreground">
              Fill the details below to analyze CKD risk.
            </p>
          </motion.div>

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-red-100 text-red-600 rounded">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* REPORT UPLOAD */}
          <ReportUpload
            onValuesExtracted={(values) => {
              setFormData((prev) => ({ ...prev, ...values }));
            }}
          />

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {Object.keys(formData).map((field) => (
                <div key={field} className="p-4 border rounded space-y-2">

                  <Label>{FIELD_LABELS[field]}</Label>

                  {categoricalFields.includes(field) ? (
                    <select
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded bg-white text-black"
                      required
                    >
                      <option value="">Select</option>

                      {["rbc", "pc"].includes(field) && (
                        <>
                          <option value="normal">Normal</option>
                          <option value="abnormal">Abnormal</option>
                        </>
                      )}

                      {["pcc", "ba"].includes(field) && (
                        <>
                          <option value="present">Present</option>
                          <option value="notpresent">Not Present</option>
                        </>
                      )}

                      {["htn", "dm", "cad", "pe", "ane"].includes(field) && (
                        <>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </>
                      )}

                      {field === "appet" && (
                        <>
                          <option value="good">Good</option>
                          <option value="poor">Poor</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <Input
                      type="number"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  )}

                </div>
              ))}

            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-10">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Predicting..." : "Predict CKD"}
              </Button>
            </div>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Prediction;