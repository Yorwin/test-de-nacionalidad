import { useEffect, useState, useRef } from "react";
import styles from "@/styles/layout/results/graphic-test-made.module.scss";
import { isTestValid } from "@/functions/functions";

/* Context */
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";

/* Firebase */
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const GraphRightTestsPercentage = () => {

    const { user, loading: authLoading } = useAuth();
    const { theme } = useTheme();

    const [totalTests, setTestsTotal] = useState(0);
    const [correctTests, setCorrectTests] = useState(0);

    const [loading, setLoading] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const canvasWidth = 260;
    const canvasHeight = 200;

    //Datos de Pruebas
    const total = totalTests;
    const passedTests = correctTests;
    const passPercentage = total > 0 ? passedTests / total : 0;

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                // Clear the canvas before drawing
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                const beginningY = 14;
                const centerX = canvasWidth / 2;
                const centerY = canvasHeight / 2;
                const radius = 55;

                // Always draw the title
                ctx.font = 'bold 24px Arial';
                ctx.fillStyle = '#CF4037';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Aciertos', centerX, beginningY);

                // Only draw the arc if there are tests
                if (passPercentage > 0) {
                    const arcAngle = passPercentage * 2 * Math.PI;
                    const startAngle = -Math.PI / 2;
                    const endAngle = startAngle + arcAngle;

                    ctx.beginPath();
                    ctx.strokeStyle = '#CF4037';
                    ctx.lineWidth = 15;
                    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                    ctx.stroke();
                    ctx.closePath();
                }

                // Always draw the percentage text
                ctx.font = 'bold 28px Arial';
                ctx.fillStyle = theme === 'light' ? '#322B2A' : '#FFFFFF';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${Math.round(passPercentage * 100)}%`, centerX, centerY);
            }
        }
    });

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
            <div className={styles["test-percentage-skeleton"]}>
                <div className={styles["skeleton-test-percentage-container"]}>
                    <div className={`skeleton-circle ${styles["skeleton-standard"]}`}></div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <canvas width={canvasWidth} height={canvasHeight} className={styles["canva-styles"]} ref={canvasRef}>Tu navegador no acepta canvas</canvas>
        </div>
    )
};

export default GraphRightTestsPercentage;