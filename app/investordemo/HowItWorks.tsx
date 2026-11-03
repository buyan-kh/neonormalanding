"use client";

import { useState } from "react";

const steps = [
  { label: "THE SETUP", title: "We turn science into a test.", description: "We give an AI a realistic workspace: scientific data, tools, and a problem to solve.", example: "EXAMPLE / Find signs of cancer returning in a blood sample." },
  { label: "THE WORK", title: "The AI works through the problem.", description: "It can read files, run code, and make decisions—like a scientist working through a real task.", example: "WORKSPACE / Data + tools + instructions" },
  { label: "THE FEEDBACK", title: "Our software checks its answer.", description: "A grader compares the result with a known answer and gives a score. AI labs can use that feedback to train and test their models.", example: "REINFORCEMENT LEARNING / Practice → feedback → improvement" },
  { label: "THE BUSINESS", title: "AI labs pay for the tests.", description: "We sell packs of these environments to AI labs. A proposed 200-task pack is $400k, or $800k for exclusive access.", example: "CUSTOMER / AI labs building better science models" },
];

export function HowItWorks() {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  return (
    <section className="walkthrough" aria-labelledby="walkthrough-heading">
      <div className="walkthrough-heading"><div><p className="label">How it works / 4 steps</p><h2 id="walkthrough-heading">What we do, simply.</h2></div><p>An RL environment is a place where AI can practice a task and learn from feedback.</p></div>
      <div className="walkthrough-box">
        <div className="walkthrough-tabs" aria-label="Choose a step">{steps.map((item, i) => <button key={item.label} type="button" onClick={() => setIndex(i)} aria-current={i === index ? "step" : undefined}><span>0{i + 1}</span> {item.label}</button>)}</div>
        <div className="walkthrough-content" aria-live="polite" aria-atomic="true"><div key={index} className="walkthrough-copy"><p className="label">STEP 0{index + 1} / {step.label}</p><h3>{step.title}</h3><p>{step.description}</p><div className="walkthrough-example">{step.example}</div></div></div>
        <div className="walkthrough-controls"><span className="label">0{index + 1} / 04</span><div><button type="button" onClick={() => setIndex(index - 1)} disabled={index === 0}>← Back</button><button className="walkthrough-next" type="button" onClick={() => setIndex(index === steps.length - 1 ? 0 : index + 1)}>{index === steps.length - 1 ? "Start again ↻" : "Next step →"}</button></div></div>
      </div>
    </section>
  );
}
