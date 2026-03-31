import React from "react";

type PlanStep = { description: string; completed?: boolean };
type PlanSection = { title: string; steps: PlanStep[] };

const plan: PlanSection[] = [
  {
    title: "Diet",
    steps: [
      { description: "Eat 5 servings of vegetables daily" },
      { description: "Limit sugar intake to 25g per day" },
    ],
  },
  {
    title: "Exercise",
    steps: [
      { description: "30 minutes of cardio, 5x per week" },
      { description: "Strength training, 3x per week" },
    ],
  },
  {
    title: "Medical",
    steps: [
      { description: "Schedule annual physical checkup" },
      { description: "Consult with a nutritionist" },
    ],
  },
  {
    title: "Supplements",
    steps: [
      { description: "Take daily multivitamin" },
      { description: "Omega-3 supplement, as recommended" },
    ],
  },
];

export default function PlanOverview() {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Personalized Plan</h2>
      {plan.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
          <ul className="list-disc pl-6">
            {section.steps.map((step, idx) => (
              <li key={idx} className="mb-1">{step.description}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}