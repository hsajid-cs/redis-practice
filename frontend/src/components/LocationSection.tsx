"use client";
import { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";

export const LocationSection = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Read countries on the client and sort them by name
  const [countries, setCountries] = useState<any[]>([]);
  const [countryNames, setCountryNames] = useState<string[]>([]);
  const [countryMap, setCountryMap] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const c = Country.getAllCountries() || [];
      c.sort((a: any, b: any) => a.name.localeCompare(b.name));
      setCountries(c);
      const names: string[] = [];
      const map: Record<string, string> = {};
      for (const co of c) {
        names.push(co.name);
        map[co.name] = co.isoCode;
      }
      setCountryNames(names);
      setCountryMap(map);
    } catch (e) {
      setCountries([]);
      setCountryNames([]);
      setCountryMap({});
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry) || [];
      countryStates.sort((a: any, b: any) => a.name.localeCompare(b.name));
      setStates(countryStates);
      // build state name list and map
      const sNames: string[] = [];
      const sMap: Record<string, string> = {};
      for (const s of countryStates) {
        sNames.push(s.name);
        sMap[s.name] = s.isoCode;
      }
      setStateNames(sNames);
      setStateMap(sMap);

      setSelectedState("");
      setSelectedCity("");
      setCities([]);

      // If no states, load cities directly
      if (countryStates.length === 0) {
        const countryCities = City.getCitiesOfCountry(selectedCountry) || [];
        countryCities.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCities(countryCities);
        const cNames = countryCities.map((c: any) => c.name);
        const cMap: Record<string, string> = {};
        for (const city of countryCities) cMap[city.name] = city.name;
        setCityNames(cNames);
        setCityMap(cMap);
      }
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState) || [];
      stateCities.sort((a: any, b: any) => a.name.localeCompare(b.name));
      setCities(stateCities);
      const cNames = stateCities.map((c: any) => c.name);
      const cMap: Record<string, string> = {};
      for (const city of stateCities) cMap[city.name] = city.name;
      setCityNames(cNames);
      setCityMap(cMap);
      setSelectedCity("");
    }
  }, [selectedState, selectedCountry]);

  // maps for states/cities by name -> iso/value
  const [stateNames, setStateNames] = useState<string[]>([]);
  const [stateMap, setStateMap] = useState<Record<string, string>>({});
  const [cityNames, setCityNames] = useState<string[]>([]);
  const [cityMap, setCityMap] = useState<Record<string, string>>({});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
        <CardDescription>Select your country, state, and city</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <Combobox
            id="country"
            items={countryNames}
            value={countryMap ? (Object.keys(countryMap).find((k) => countryMap[k] === selectedCountry) || "") : ""}
            onChange={(label) => {
              const iso = countryMap[label];
              setSelectedCountry(iso || "");
              // reset dependent fields
              setSelectedState("");
              setSelectedCity("");
            }}
            placeholder="Select a country"
            allowFreeInput={false}
          />
        </div>

        {states.length > 0 && (
          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium">
              State
            </label>
            <Combobox
              id="state"
              items={stateNames}
              value={stateMap ? (Object.keys(stateMap).find((k) => stateMap[k] === selectedState) || "") : ""}
              onChange={(label) => {
                const iso = stateMap[label];
                setSelectedState(iso || "");
                setSelectedCity("");
              }}
              placeholder="Select a state"
              allowFreeInput={false}
            />
          </div>
        )}

        {(cities.length > 0 || (selectedCountry && states.length === 0)) && (
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <Combobox
              id="city"
              items={cityNames}
              value={cityMap ? (Object.keys(cityMap).find((k) => cityMap[k] === selectedCity) || "") : ""}
              onChange={(label) => {
                const v = cityMap[label] || label;
                setSelectedCity(v || "");
              }}
              placeholder="Select a city"
              allowFreeInput={false}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};