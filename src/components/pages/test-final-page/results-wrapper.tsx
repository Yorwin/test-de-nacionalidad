"use client";

import { use } from "react";

/* Components */
import Results from "@/components/pages/test-final-page/results";

/* Context */
import { AuthProvider } from "@/context/auth-context";

type Props = {
    params: Promise<{
        testId: string,
    }>
};

const ResultsWrapper = ({ params }: Props) => {
    const { testId } = use(params);

    return (
        <AuthProvider>
            <Results testId={testId} />
        </AuthProvider>
    );
};

export default ResultsWrapper;