"use client";
import React, { useEffect, useRef, useState } from "react";

type ComboboxProps = {
  items: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
  allowFreeInput?: boolean;
};

export const Combobox = ({ items, value, onChange, placeholder, id, allowFreeInput = true }: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);
  const LARGE_LIST_THRESHOLD = 500; // when items > this, require typing before rendering full list
  const MIN_QUERY_LENGTH = 2; // min chars to trigger search on large lists
  const MAX_VISIBLE = 200; // cap number of rendered items

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    // keep query synced with value for display when value changes externally
    if (!value) setQuery("");
    // when the selected value changes, reflect it in the visible input
    if (value) setQuery(value);
  }, [value]);

  // Avoid rendering the full items array when it's very large and the user hasn't typed yet.
  const shouldRequireTyping = items.length > LARGE_LIST_THRESHOLD && query.trim().length < MIN_QUERY_LENGTH;
  const filtered = shouldRequireTyping
    ? []
    : query
    ? items.filter((it) => it.toLowerCase().includes(query.toLowerCase()))
    : items;

  const onSelect = (v: string) => {
    onChange(v);
    setQuery(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <input
        id={id}
        value={query || value}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          // Enter selects the first filtered item when open
          if (e.key === "Enter") {
            if (filtered.length > 0) {
              e.preventDefault();
              onSelect(filtered[0]);
            } else {
              // if no filtered items, enforce selection-only when not allowed
              if (!allowFreeInput) {
                e.preventDefault();
                setOpen(false);
                setQuery(value);
              } else {
                // allow free input to be kept
                setOpen(false);
              }
            }
          } else if (e.key === "Escape") {
            setOpen(false);
            setQuery(value);
          }
        }}
        onBlur={() => {
          // when free input is not allowed, only accept exact-match selections
          if (!allowFreeInput) {
            const exactMatch = items.find((it) => it === query);
            if (exactMatch) {
              // commit selection
              onSelect(exactMatch);
            } else {
              // revert to previous selected value
              setQuery(value);
            }
          }
          setOpen(false);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2"
      />

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
          {shouldRequireTyping ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Type {MIN_QUERY_LENGTH}+ characters to search {items.length} items</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
          ) : (
            <>
              {filtered.slice(0, MAX_VISIBLE).map((it, idx) => (
                <div
                  key={idx}
                  role="button"
                  onMouseDown={(e) => {
                    // prevent input blur from firing before we handle selection
                    e.preventDefault();
                    onSelect(it);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-100"
                >
                  {it}
                </div>
              ))}
              {filtered.length > MAX_VISIBLE && (
                <div className="px-3 py-2 text-sm text-muted-foreground">Showing {MAX_VISIBLE} of {filtered.length} results</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Combobox;
