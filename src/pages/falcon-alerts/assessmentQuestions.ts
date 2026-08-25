export const ASSESSMENT_QUESTIONS = [
  "Are the wires disconnected?",
  "Is the tracker still on the vehicle?",
  "Is the tracker functional?",
  "Is the relay on the vehicle?",
  "Is the relay functional?",
  "Is the SIM card tampered with?",
  "Is the metal bracket vandalised?",
] as const

export type AssessmentAnswer = "yes" | "no"

export type AssessmentAnswers = Record<string, AssessmentAnswer>
