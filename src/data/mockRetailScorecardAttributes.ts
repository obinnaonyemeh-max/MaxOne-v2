export interface ScorecardAttributeOption {
  id: string
  label: string
  marks: number
}

export interface ScorecardAttribute {
  id: string
  name: string
  options: ScorecardAttributeOption[]
  createdAt: string
}

export function getAttributeMarks(attribute: ScorecardAttribute): number {
  return attribute.options.reduce((max, option) => Math.max(max, option.marks), 0)
}

let optionSeq = 1
function options(pairs: [string, number][]): ScorecardAttributeOption[] {
  return pairs.map(([label, marks]) => ({ id: `opt-${optionSeq++}`, label, marks }))
}

export const mockRetailScorecardAttributes: ScorecardAttribute[] = [
  {
    id: "highest-level-of-education",
    name: "Highest Level Of Education",
    createdAt: "2026-05-05",
    options: options([
      ["Secondary School", 2],
      ["Tertiary / Degree", 5],
    ]),
  },
  {
    id: "duration-at-current-address",
    name: "Duration At Current Address",
    createdAt: "2026-05-05",
    options: options([
      ["Less than 6 Months", 2],
      ["6 – 12 Months", 4],
      ["1 – 2 Years", 6],
      ["2 – 5 Years", 8],
      ["5+ Years", 10],
    ]),
  },
  {
    id: "gender",
    name: "Gender",
    createdAt: "2026-04-13",
    options: options([
      ["Male", 4],
      ["Female", 5],
    ]),
  },
  {
    id: "guarantor-relationship-to-champion",
    name: "Guarantor Relationship to Champion",
    createdAt: "2025-09-04",
    options: options([
      ["Spouse", 10],
      ["Parent", 9],
      ["Sibling", 8],
      ["Child", 7],
      ["Other Relative", 6],
      ["Friend", 5],
      ["Colleague", 4],
      ["Employer", 3],
    ]),
  },
  {
    id: "guarantor-occupation",
    name: "Guarantor Occupation",
    createdAt: "2025-09-04",
    options: options([
      ["Employed", 6],
      ["Self-Employed", 4],
      ["Unemployed", 2],
    ]),
  },
  {
    id: "guarantor-age",
    name: "Guarantor Age",
    createdAt: "2025-09-04",
    options: options([
      ["18 – 25", 3],
      ["26 – 35", 8],
      ["36 – 45", 6],
      ["46+", 4],
    ]),
  },
  {
    id: "vision-score",
    name: "Vision Score",
    createdAt: "2025-09-04",
    options: options([
      ["Poor", 2],
      ["Average", 6],
      ["Good", 10],
    ]),
  },
  {
    id: "psychometric-score",
    name: "Psychometric Score",
    createdAt: "2025-09-04",
    options: options([
      ["Low", 3],
      ["Medium", 6],
      ["High", 10],
    ]),
  },
  {
    id: "safety-score",
    name: "Safety Score",
    createdAt: "2025-09-04",
    options: options([
      ["Low", 4],
      ["Medium", 7],
      ["High", 11],
    ]),
  },
  {
    id: "guarantor-years-of-knowing",
    name: "Guarantor Years of Knowing",
    createdAt: "2025-09-04",
    options: options([
      ["Less than 1 Year", 2],
      ["1 – 3 Years", 5],
      ["3+ Years", 7],
    ]),
  },
  {
    id: "no-of-dependants",
    name: "No of Dependants",
    createdAt: "2025-09-04",
    options: options([
      ["0", 6],
      ["1 – 2", 4],
      ["3+", 2],
    ]),
  },
  {
    id: "marital-status",
    name: "Marital Status",
    createdAt: "2025-09-04",
    options: options([
      ["Single", 3],
      ["Married", 6],
      ["Divorced", 4],
      ["Widowed", 5],
    ]),
  },
  {
    id: "age",
    name: "Age",
    createdAt: "2025-09-04",
    options: options([
      ["18 – 25", 5],
      ["26 – 35", 10],
      ["36 – 45", 8],
      ["46+", 6],
    ]),
  },
  {
    id: "asset-purpose",
    name: "Asset Purpose",
    createdAt: "2025-09-04",
    options: options([
      ["Personal Use", 4],
      ["Commercial Use", 6],
    ]),
  },
]

export interface PriorityMarkThreshold {
  id: string
  label: string
  minScore: number
  maxScore: number
}

export const mockPriorityMarkThresholds: PriorityMarkThreshold[] = [
  { id: "high", label: "High Priority", minScore: 80, maxScore: 110 },
  { id: "medium", label: "Medium Priority", minScore: 50, maxScore: 79 },
  { id: "low", label: "Low Priority", minScore: 0, maxScore: 49 },
]
