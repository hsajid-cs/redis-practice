"use client";
import React, { createContext, useContext, useRef, useEffect, useState } from "react";

type SelectContextType = {
	value: string;
	onChange: (v: string) => void;
	open: boolean;
	setOpen: (b: boolean) => void;
};

const SelectContext = createContext<SelectContextType | null>(null);

export const Select = ({ value, onValueChange, children }: any) => {
	const [open, setOpen] = useState(false);
	return (
		<SelectContext.Provider value={{ value: value || "", onChange: onValueChange, open, setOpen }}>
			<div className="relative inline-block w-full">{children}</div>
		</SelectContext.Provider>
	);
};

export const SelectTrigger = ({ children }: any) => {
	const ctx = useContext(SelectContext);
	if (!ctx) return null;
	const onToggle = () => ctx.setOpen(!ctx.open);
	return (
		<button type="button" onClick={onToggle} className="w-full text-left border rounded-md px-3 py-2 bg-white">
			{children}
		</button>
	);
};

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
	const ctx = useContext(SelectContext);
	const val = ctx?.value ?? "";
	return <span className={`text-sm ${val ? "text-foreground" : "text-muted-foreground"}`}>{val || placeholder}</span>;
};

export const SelectContent = ({ children }: any) => {
	const ctx = useContext(SelectContext);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function onDoc(e: MouseEvent) {
			if (!ctx || !ctx.open) return;
			if (ref.current && !ref.current.contains(e.target as Node)) {
				ctx.setOpen(false);
			}
		}
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, [ctx]);

	if (!ctx || !ctx.open) return null;
	return (
		<div ref={ref} className="absolute z-50 left-0 right-0 mt-1 border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
			{children}
		</div>
	);
};

export const SelectItem = ({ value, children }: any) => {
	const ctx = useContext(SelectContext);
	if (!ctx) return null;
	const selected = ctx.value === value;
	const onClick = () => {
		ctx.onChange(value);
		ctx.setOpen(false);
	};
	return (
		<div
			role="button"
			onClick={onClick}
			className={`px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center ${selected ? "bg-slate-100 font-medium" : ""}`}
		>
			{children}
		</div>
	);
};

export default Select;

