"use client"

import { use } from "react";

/* Componentes de Página */
import SimulationResults from "@/components/pages/results/simulation-results/simulation-results";

/* Context */
import { AuthProvider } from "@/context/auth-context";

type Props = {
    params: Promise<{
        respuestaId: string,
    }>
};

const RespuestaDetalle = ({ params }: Props) => {
    const { respuestaId } = use(params);

    return (
        <AuthProvider>
            <SimulationResults questionId={respuestaId} />
        </AuthProvider>
    )
};

export default RespuestaDetalle;