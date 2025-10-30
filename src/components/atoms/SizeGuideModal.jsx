import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const SizeGuideModal = ({ isOpen, onClose, category = "Kids Clothing" }) => {
  const [activeTab, setActiveTab] = useState("chart");

  if (!isOpen) return null;

  const tabs = [
    { id: "chart", label: "Size Chart", icon: "Ruler" },
    { id: "measure", label: "How to Measure", icon: "Pencil" },
    { id: "tips", label: "Size Tips", icon: "Lightbulb" }
  ];

  const sizeChartData = [
    { age: "0-3 months", size: "NB", chest: "16\"", waist: "16\"", height: "21-24\"" },
    { age: "3-6 months", size: "3M", chest: "17\"", waist: "17\"", height: "24-26\"" },
    { age: "6-12 months", size: "6M", chest: "18\"", waist: "18\"", height: "26-29\"" },
    { age: "12-18 months", size: "12M", chest: "19\"", waist: "19\"", height: "29-31\"" },
    { age: "18-24 months", size: "18M", chest: "20\"", waist: "19.5\"", height: "31-33\"" },
    { age: "2-3 years", size: "2T", chest: "21\"", waist: "20\"", height: "33-36\"" },
    { age: "3-4 years", size: "3T", chest: "22\"", waist: "20.5\"", height: "36-39\"" },
    { age: "4-5 years", size: "4T", chest: "23\"", waist: "21\"", height: "39-42\"" },
    { age: "5-6 years", size: "XS", chest: "24\"", waist: "21.5\"", height: "42-45\"" },
    { age: "6-7 years", size: "S", chest: "25\"", waist: "22\"", height: "45-48\"" },
    { age: "7-8 years", size: "S", chest: "26\"", waist: "22.5\"", height: "48-51\"" },
    { age: "8-9 years", size: "M", chest: "27\"", waist: "23\"", height: "51-54\"" },
    { age: "9-10 years", size: "M", chest: "28\"", waist: "23.5\"", height: "54-57\"" },
    { age: "10-11 years", size: "L", chest: "29\"", waist: "24\"", height: "57-60\"" },
    { age: "11-12 years", size: "L", chest: "30\"", waist: "24.5\"", height: "60-63\"" },
    { age: "12+ years", size: "XL", chest: "31\"", waist: "25\"", height: "63+\"" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ApperIcon name="Ruler" size={20} className="text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl text-gray-800">
              Size Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 font-semibold transition-all relative",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <ApperIcon name={tab.icon} size={18} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === "chart" && (
            <div>
              <p className="text-gray-600 mb-6 text-sm">
                Use this chart to find the perfect size based on your child's age and measurements.
                All measurements are in inches.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-display font-semibold text-gray-800 border-b-2 border-gray-200">
                        Age Range
                      </th>
                      <th className="px-4 py-3 text-left font-display font-semibold text-gray-800 border-b-2 border-gray-200">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left font-display font-semibold text-gray-800 border-b-2 border-gray-200">
                        Chest
                      </th>
                      <th className="px-4 py-3 text-left font-display font-semibold text-gray-800 border-b-2 border-gray-200">
                        Waist
                      </th>
                      <th className="px-4 py-3 text-left font-display font-semibold text-gray-800 border-b-2 border-gray-200">
                        Height
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChartData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-700">{row.age}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-semibold rounded-lg">
                            {row.size}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{row.chest}</td>
                        <td className="px-4 py-3 text-gray-700">{row.waist}</td>
                        <td className="px-4 py-3 text-gray-700">{row.height}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "measure" && (
            <div className="space-y-6">
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ApperIcon name="Info" size={20} className="text-info mt-0.5" />
                  <p className="text-sm text-gray-700">
                    For the most accurate measurements, have your child stand up straight with arms at their sides.
                    Use a soft measuring tape and measure over thin clothing.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-primary text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-800 mb-2">Chest</h4>
                    <p className="text-gray-600 text-sm">
                      Measure around the fullest part of the chest, keeping the tape parallel to the floor.
                      The tape should be snug but not tight.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-primary text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-800 mb-2">Waist</h4>
                    <p className="text-gray-600 text-sm">
                      Measure around the natural waistline (the narrowest part of the torso).
                      Keep the tape comfortably loose.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-primary text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-800 mb-2">Height</h4>
                    <p className="text-gray-600 text-sm">
                      Measure from the top of the head to the floor. Have your child stand barefoot against a wall
                      with heels together and back straight.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-primary text-lg">4</span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-800 mb-2">Inseam (for pants)</h4>
                    <p className="text-gray-600 text-sm">
                      Measure from the crotch seam to the bottom of the ankle along the inside of the leg.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="space-y-4">
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-start gap-3">
                <ApperIcon name="Check" size={20} className="text-success mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-semibold text-gray-800 mb-1">Between Sizes?</h4>
                  <p className="text-sm text-gray-700">
                    If measurements are between two sizes, we recommend sizing up for growing room and comfort.
                  </p>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
                <ApperIcon name="AlertCircle" size={20} className="text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-semibold text-gray-800 mb-1">Consider Growth</h4>
                  <p className="text-sm text-gray-700">
                    Kids grow fast! Consider buying one size up if you're purchasing for a future season.
                  </p>
                </div>
              </div>

              <div className="bg-info/10 border border-info/20 rounded-lg p-4 flex items-start gap-3">
                <ApperIcon name="Shirt" size={20} className="text-info mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-semibold text-gray-800 mb-1">Fit Preferences</h4>
                  <p className="text-sm text-gray-700">
                    Some items are designed for a looser fit. Check product descriptions for fit notes.
                    "Fits true to size" means the item matches standard sizing. "Runs small" or "Runs large" 
                    indicates you may want to size up or down accordingly.
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                <ApperIcon name="Heart" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-semibold text-gray-800 mb-1">Comfort First</h4>
                  <p className="text-sm text-gray-700">
                    Kids clothing should allow for movement and play. If in doubt, choose the larger size
                    for better comfort and longer wear time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button
            onClick={onClose}
            className="px-6"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;