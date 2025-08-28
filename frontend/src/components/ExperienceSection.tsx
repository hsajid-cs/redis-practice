import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roles = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "Product Manager",
  "Project Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Technical Lead",
  "Engineering Manager",
  "CTO",
  "Consultant",
  "Business Analyst",
  "Quality Assurance Engineer",
  "Mobile Developer",
  "Cloud Architect"
];

const companies = [
  "Google",
  "Microsoft",
  "Apple",
  "Amazon",
  "Meta (Facebook)",
  "Netflix",
  "Tesla",
  "IBM",
  "Oracle",
  "Salesforce",
  "Adobe",
  "Spotify",
  "Uber",
  "Airbnb",
  "Twitter",
  "LinkedIn",
  "Dropbox",
  "Slack",
  "Zoom",
  "GitHub",
  "Atlassian",
  "Shopify",
  "Square",
  "PayPal",
  "Stripe",
  "Coinbase",
  "Palantir",
  "Snowflake",
  "Databricks",
  "Other"
];

export const ExperienceSection = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
        <CardDescription>Select your current or most recent role and company</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium">
            Company
          </label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger>
              <SelectValue placeholder="Select your company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};