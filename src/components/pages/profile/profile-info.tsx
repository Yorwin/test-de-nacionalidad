"use client"

import { useEffect, useState } from "react";
import styles from "@/styles/layout/profile/profile-info.module.scss"
import ProfileImg from "@/resources/profile-default.png"
import Image from "next/image";

/* Firebase */
import { db } from "@/firebase/firebase";
import { getDoc, doc } from "firebase/firestore";

/* Context */
import { useAuth } from "@/context/auth-context";

const ProfileInfo = () => {

    const { userData, loading: authLoading } = useAuth();

    const [userName, setUserName] = useState<string>("");
    const [accountCreationTime, setAccountCreationTime] = useState<string>("");

    const getUserData = async (userId: string) => {
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            let accountData;

            if (userSnap.exists()) {

                const userInfo = userSnap.data();

                accountData = {
                    name: userInfo.username,
                    createdAt: userInfo.createdAt,
                }
            } else {
                accountData = {
                    name: "Undefined Undefined",
                    createdAt: "There's no info to be shown",
                }
            }

            const createdAt = accountData.createdAt;
            const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6);

            const month = date.toLocaleString("es-ES", { month: "long" });
            const year = date.getFullYear();

            const formatted = `Cuenta creada en ${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`;

            setAccountCreationTime(formatted);
            setUserName(accountData.name);

        } catch (error) {
            console.error("Se ha producido un error al intentar obtener los datos del usuario");
        }
    }

    useEffect(() => {
        console.log(userData);
        /* getUserData(user.uid); */
    }, [userData]);

    if (authLoading) {
        return (
            <h3>Cargando...</h3>
        )
    }

    return (
        <div className={styles["profile-container"]}>
            <div className={styles["content"]}>
                <div className={styles["photo-container"]}>
                    <div className={styles["profile-img"]}>
                        <Image
                            src={ProfileImg}
                            alt="Imagen por defecto del perfil"
                            className={styles["profile-image"]}
                            fill
                        />
                    </div>
                    <div className={styles["add-new-img"]}>
                        <i className="bi bi-plus"></i>
                    </div>
                </div>
                <div className={styles["account-info"]}>
                    <h3>{userName}</h3>
                    <p>{accountCreationTime}</p>
                </div>
            </div>
        </div>
    )
};

export default ProfileInfo;