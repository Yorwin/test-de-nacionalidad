"use client"

import { useEffect, useState, useRef } from "react";
import styles from "@/styles/layout/profile/profile-info.module.scss"
import ProfileImg from "@/resources/profile-default.png"
import Image from "next/image";

/* Profile Skeleton Loader */
import ProfileInfoLoadingSkeleton from "./profile-info-loading-skeleton";

/* Functions */
import { calculateCreatedAtMs } from "@/functions/functions";

/* Context */
import { useAuth } from "@/context/auth-context";

/* Firebase */
import { uploadProfilePhoto } from "@/firebase/firebase";

const ProfileInfo = () => {

    const { userData, loading: authLoading } = useAuth();

    const [userName, setUserName] = useState<string>("");
    const [accountCreationTime, setAccountCreationTime] = useState<string>("");
    const [profilePhotoURL, setProfilePhotoURL] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const getUserData = async () => {
        if (!userData) {
            return null;
        }

        try {
            const date = calculateCreatedAtMs(userData.createdAt)
            setAccountCreationTime(date);
            setUserName(userData.username);
            setProfilePhotoURL(userData.profilePhotoURL || "");
        } catch (error) {
            console.error("Se ha producido un error al intentar obtener los datos del usuario");
        }
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !userData?.uid) return;

        setUploading(true);
        setUploadError(null);

        try {
            const downloadURL = await uploadProfilePhoto(file, userData.uid);
            setProfilePhotoURL(downloadURL);
            // Refresh user data to get updated profilePhotoURL
            if (userData) {
                setProfilePhotoURL(userData.profilePhotoURL || downloadURL);
            }
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Error al subir la foto');
        } finally {
            setUploading(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        getUserData();
    }, [userData]);

    if (authLoading) {
        return (
            <ProfileInfoLoadingSkeleton />
        )
    }

    return (
        <div className={styles["profile-container"]}>
            <div className={styles["content"]}>
                <div className={styles["photo-container"]}>
                    <div className={styles["profile-img"]}>
                        <Image
                            src={profilePhotoURL || ProfileImg}
                            alt="Foto de perfil"
                            className={styles["profile-image"]}
                            fill
                        />
                        {uploading && (
                            <div className={styles["upload-overlay"]}>
                                <div className={styles["loading-spinner"]}>
                                    <i className="bi bi-arrow-clockwise"></i>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles["add-new-img"]}>
                        <button
                            className={styles["button-add-img"]}
                            onClick={() => alert("Por el momento este feature no esta disponible")}
                            disabled={uploading}
                        >
                            <i className="bi bi-plus"></i>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/jpeg,image/png"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
                {uploadError && (
                    <div className={styles["error-message"]}>
                        {uploadError}
                    </div>
                )}
                <div className={styles["account-info"]}>
                    <h3>{userName}</h3>
                    <p>{accountCreationTime}</p>
                </div>
            </div>
        </div>
    )
};

export default ProfileInfo;