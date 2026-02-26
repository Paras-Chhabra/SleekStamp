import React, { createContext, useContext, useState, useCallback } from "react";

export interface BuilderState {
    step: number;
    selectedVariantId: string | null;
    selectedVariantTitle: string;
    selectedVariantPrice: number;
    logoFile: File | null;
    logoPreviewUrl: string | null;
    stampPadSelected: boolean;
    stampPadVariantId: string | null;
    stampPadName: string;
    stampPadPrice: number;
    inkColor: string;
    prioritySelected: boolean;
    priorityVariantId: string | null;
    priorityPrice: number;
}

const initialState: BuilderState = {
    step: 0,
    selectedVariantId: null,
    selectedVariantTitle: "",
    selectedVariantPrice: 0,
    logoFile: null,
    logoPreviewUrl: null,
    stampPadSelected: false,
    stampPadVariantId: null,
    stampPadName: "",
    stampPadPrice: 0,
    inkColor: "Black",
    prioritySelected: false,
    priorityVariantId: null,
    priorityPrice: 0,
};

interface BuilderContextType {
    state: BuilderState;
    setState: React.Dispatch<React.SetStateAction<BuilderState>>;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    totalPrice: number;
    reset: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<BuilderState>(initialState);

    const nextStep = useCallback(() => {
        setState((s) => ({ ...s, step: Math.min(s.step + 1, 5) }));
    }, []);

    const prevStep = useCallback(() => {
        setState((s) => ({ ...s, step: Math.max(s.step - 1, 0) }));
    }, []);

    const goToStep = useCallback((step: number) => {
        setState((s) => ({ ...s, step: Math.max(0, Math.min(step, 5)) }));
    }, []);

    const totalPrice =
        state.selectedVariantPrice +
        (state.stampPadSelected ? state.stampPadPrice : 0) +
        (state.prioritySelected ? state.priorityPrice : 0);

    const reset = useCallback(() => setState(initialState), []);

    return (
        <BuilderContext.Provider
            value={{ state, setState, nextStep, prevStep, goToStep, totalPrice, reset }}
        >
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    const ctx = useContext(BuilderContext);
    if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
    return ctx;
}
