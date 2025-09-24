import React from "react";
import { LocationSection } from "@/components/LocationSection";
import { EducationSection } from "@/components/EducationSection";
import { ExperienceSection } from "@/components/ExperienceSection";

const Index = () => {

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile Builder</h1>
          <p className="text-muted-foreground mt-2">Build your professional profile step by step</p>
        </div>
        
        <LocationSection />
        <EducationSection />
        <ExperienceSection />
      </div>
    </div>
  );
};

export default Index;
