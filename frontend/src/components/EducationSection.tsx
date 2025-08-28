import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const degrees = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree (BSc/BA)",
  "Master's Degree (MSc/MA)",
  "MBA",
  "PhD",
  "Professional Certification",
  "Other"
];

const institutions = [
  "Harvard University",
  "Stanford University",
  "MIT",
  "University of Cambridge",
  "University of Oxford",
  "UC Berkeley",
  "UCLA",
  "Princeton University",
  "Yale University",
  "Columbia University",
  "University of Chicago",
  "Cornell University",
  "University of Pennsylvania",
  "Carnegie Mellon University",
  "Georgia Institute of Technology",
  "University of Michigan",
  "University of Toronto",
  "McGill University",
  "London School of Economics",
  "Imperial College London"
];

export const EducationSection = () => {
  const [selectedDegree, setSelectedDegree] = useState<string>("");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Select your highest degree and institution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="degree" className="text-sm font-medium">
            Degree
          </label>
          <Select value={selectedDegree} onValueChange={setSelectedDegree}>
            <SelectTrigger>
              <SelectValue placeholder="Select your degree" />
            </SelectTrigger>
            <SelectContent>
              {degrees.map((degree) => (
                <SelectItem key={degree} value={degree}>
                  {degree}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="institution" className="text-sm font-medium">
            Institution
          </label>
          <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
            <SelectTrigger>
              <SelectValue placeholder="Select your institution" />
            </SelectTrigger>
            <SelectContent>
              {institutions.map((institution) => (
                <SelectItem key={institution} value={institution}>
                  {institution}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};