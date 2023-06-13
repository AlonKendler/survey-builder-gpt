// surveyTemplates.js

export const TEMPLATE_PLACEHOLDER = {
  label: "Select a template...",
  values: {
    projectName: "",
    projectDescription: "",
    researchObjectives: ["", "", ""],
    includeName: true,
    includeEmail: true,
    includeGeneratedText: true,
    includeGeneratedDescription: true,
    askForAge: false,
    askForGender: false,
    askForLocation: false,
    askForJob: false,
    targetAudience: {
      ageRange: "",
      gender: "",
      location: "",
      otherDemographics: "",
    },
  },
};

const ex1 =
{
  "projectName": "Consumer Electronics Preference",
  "projectDescription": "A survey to understand consumer preferences for electronic devices.",
  "researchObjectives": ["Identify most popular electronic devices", "Understand key factors influencing purchase decisions", "Determine market segments"],
  "includeName": true,
  "includeEmail": false,
  "includeGeneratedText": true,
  "includeGeneratedDescription": true,
  "askForAge": true,
  "askForGender": true,
  "askForLocation": true,
  "askForJob": false,
  "targetAudience": {
    "ageRange": "18-50",
    "gender": "all",
    "location": "global",
    "otherDemographics": "people interested in technology"
  }
}
