import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { fetchCollection, fetchCollectionTimed } from "../lib";

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
  const [remoteRoles, setRemoteRoles] = useState<string[] | null>(null);
  const [remoteCompanies, setRemoteCompanies] = useState<string[] | null>(null);
  const [rolesTime, setRolesTime] = useState<number | null>(null);
  const [companiesTime, setCompaniesTime] = useState<number | null>(null);
  const [rolesRender, setRolesRender] = useState<number | null>(null);
  const [companiesRender, setCompaniesRender] = useState<number | null>(null);
  const [rolesServer, setRolesServer] = useState<number | null>(null);
  const [companiesServer, setCompaniesServer] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const rRes = await fetchCollectionTimed("roles");
        const cRes = await fetchCollectionTimed("companies");
        if (!mounted) return;
        const tAfterFetch = performance.now();
        setRemoteRoles(Array.isArray(rRes.items) ? rRes.items : []);
        setRemoteCompanies(Array.isArray(cRes.items) ? cRes.items : []);
        setTimeout(() => {
          if (!mounted) return;
          const tAfterRender = performance.now();
          const renderMs = Math.round(tAfterRender - tAfterFetch);
          setRolesTime(rRes.fetchTimeMs ?? null);
          setCompaniesTime(cRes.fetchTimeMs ?? null);
          setRolesRender(renderMs);
          setCompaniesRender(renderMs);
        }, 0);
        setRolesServer(rRes.serverTimeMs ?? null);
        setCompaniesServer(cRes.serverTimeMs ?? null);
      } catch (e) {
        // keep local fallback
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
        <CardDescription>Select your current or most recent role and company</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role <span className="text-sm text-muted-foreground">({(remoteRoles ?? roles).length})</span>
          </label>
          <div className="flex items-center gap-3">
            <Combobox id="role" items={remoteRoles ?? roles} value={selectedRole} onChange={setSelectedRole} placeholder="Select your role" />
            {/* <div className="text-sm text-muted-foreground">
              {rolesServer !== null && <span>srv {rolesServer}ms</span>}
              {rolesTime !== null && <span> • net {rolesTime}ms</span>}
              {rolesRender !== null && <span> • render {rolesRender}ms</span>}
            </div> */}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium">
            Company <span className="text-sm text-muted-foreground">({(remoteCompanies ?? companies).length})</span>
          </label>
          <div className="flex items-center gap-3">
            <Combobox id="company" items={remoteCompanies ?? companies} value={selectedCompany} onChange={setSelectedCompany} placeholder="Select your company" />
            {/* <div className="text-sm text-muted-foreground">
              {companiesServer !== null && <span>srv {companiesServer}ms</span>}
              {companiesTime !== null && <span> • net {companiesTime}ms</span>}
              {companiesRender !== null && <span> • render {companiesRender}ms</span>}
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};