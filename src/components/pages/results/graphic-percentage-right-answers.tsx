import { useEffect, useState, useRef } from "react";
import styles from "@/styles/layout/results/graphic-test-made.module.scss";
import { isTestValid } from "@/functions/functions";

/* Context */
import { useAuth } from "@/context/auth-context";

/* Firebase */
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const GraphRightTestsPercentage = () => {

    const { user, loading: authLoading } = useAuth();

    const [totalTests, setTestsTotal] = useState(0);
    const [correctTests, setCorrectTests] = useState(0);

    const [loading, setLoading] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const canvasWidth = 260;
    const canvasHeight = 200;

    //Datos de Pruebas
    const total = totalTests;
    const passedTests = correctTests;
    const passPercentage = passedTests / total;

    useEffect(() => {
        if (canvasRef.current && totalTests) {
            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {

                const beginningY = 14;
                const centerX = canvasWidth / 2;
                const centerY = canvasHeight / 2;
                const radius = 55;

                const arcAngle = passPercentage * 2 * Math.PI;

                const startAngle = -Math.PI / 2;
                const endAngle = startAngle + arcAngle;

                ctx.font = 'bold 24px Arial';
                ctx.fillStyle = '#CF4037';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Aciertos', centerX, beginningY);

                ctx.beginPath();

                ctx.strokeStyle = '#CF4037'
                ctx.lineWidth = 15;
                ctx.arc(centerX, centerY, radius, startAngle, endAngle)
                ctx.stroke()

                ctx.closePath();

                if (totalTests && correctTests) {
                    ctx.font = 'bold 28px Arial';
                    ctx.fillStyle = '#322B2A';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${passedTests != 0 ? Math.round(passPercentage * 100) : 0}%`, centerX, centerY);
                } else {
                    ctx.font = 'bold 28px Arial';
                    ctx.fillStyle = '#322B2A';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${0}%`, centerX, centerY);
                }
            }
        }
    }, [totalTests, correctTests]);

    useEffect(() => {

        /* Obtener simulaciones de Firestore */
        const getTestsResults = async () => {
            if (!user) {
                return null;
            }

            try {
                const totalTestsResults: number[] = [];
                const resultsRef = collection(db, "users", user.uid, "resultados");
                const querySnapshot = await getDocs(resultsRef);

                querySnapshot.forEach(doc => {
                    const data = doc.data();

                    if (data.testId === "test_simulation") {
                        const score = data.score;
                        totalTestsResults.push(score);
                    }
                })

                /* Total de Simulaciones */
                setTestsTotal(totalTestsResults.length);

                /* Simulaciones aprobadas */
                const approvedTests = isTestValid(totalTestsResults);
                setCorrectTests(approvedTests);
            } catch (error) {
                console.error(`Error al intentar obtener los resultados de las simulaciones ${error}`);
            } finally {
                setLoading(false);
            }
        };

        getTestsResults();
    }, [user]);

    if ((!user && authLoading) || loading) {
        return (
            <h3>Cargando resultados...</h3>
        )
    }

    return <>
        <canvas width={canvasWidth} height={canvasHeight} className={styles["canva-styles"]} ref={canvasRef}>Tu navegador no acepta canvas</canvas>
    </>
};

export default GraphRightTestsPercentage;