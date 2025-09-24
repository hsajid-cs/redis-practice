import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { fetchCollection, fetchCollectionTimed } from "../lib";

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
  const [remoteDegrees, setRemoteDegrees] = useState<string[] | null>(null);
  const [remoteInstitutions, setRemoteInstitutions] = useState<string[] | null>(null);

  const [degreesTime, setDegreesTime] = useState<number | null>(null);
  const [institutionsTime, setInstitutionsTime] = useState<number | null>(null);
  const [degreesRender, setDegreesRender] = useState<number | null>(null);
  const [institutionsRender, setInstitutionsRender] = useState<number | null>(null);
  const [degreesServer, setDegreesServer] = useState<number | null>(null);
  const [institutionsServer, setInstitutionsServer] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const dRes = await fetchCollectionTimed("degrees");
        const iRes = await fetchCollectionTimed("institutions");
        if (!mounted) return;
        const tAfterFetch = performance.now();
        setRemoteDegrees(Array.isArray(dRes.items) ? dRes.items : []);
        setRemoteInstitutions(Array.isArray(iRes.items) ? iRes.items : []);
        // measure render/update time on next tick
        setTimeout(() => {
          if (!mounted) return;
          const tAfterRender = performance.now();
          const renderMs = Math.round(tAfterRender - tAfterFetch);
          setDegreesTime(dRes.fetchTimeMs ?? null);
          setInstitutionsTime(iRes.fetchTimeMs ?? null);
          setDegreesRender(renderMs);
          setInstitutionsRender(renderMs);
        }, 0);
        setDegreesServer(dRes.serverTimeMs ?? null);
        setInstitutionsServer(iRes.serverTimeMs ?? null);
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
        <CardTitle>Education</CardTitle>
        <CardDescription>Select your highest degree and institution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="degree" className="text-sm font-medium">
            Degree <span className="text-sm text-muted-foreground">({(remoteDegrees ?? degrees).length})</span>
          </label>
          <div className="flex items-center gap-3">
            <Combobox
              id="degree"
              items={remoteDegrees ?? degrees}
              value={selectedDegree}
              onChange={setSelectedDegree}
              placeholder="Select your degree"
            />
            {/* <div className="text-sm text-muted-foreground">
              {degreesServer !== null && <span>srv {degreesServer}ms</span>}
              {degreesTime !== null && <span> • net {degreesTime}ms</span>}
              {degreesRender !== null && <span> • render {degreesRender}ms</span>}
            </div> */}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="institution" className="text-sm font-medium">
            Institution <span className="text-sm text-muted-foreground">({(remoteInstitutions ?? institutions).length})</span>
          </label>
          <div className="flex items-center gap-3">
            <Combobox
              id="institution"
              items={remoteInstitutions ?? institutions}
              value={selectedInstitution}
              onChange={setSelectedInstitution}
              placeholder="Select your institution"
            />
            {/* <div className="text-sm text-muted-foreground">
              {institutionsServer !== null && <span>srv {institutionsServer}ms</span>}
              {institutionsTime !== null && <span> • net {institutionsTime}ms</span>}
              {institutionsRender !== null && <span> • render {institutionsRender}ms</span>}
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};