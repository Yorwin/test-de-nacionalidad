import styles from "@/styles/layout/profile/profile.module.scss";
import Link from "next/link";

/* Components */
import HomeLink from "@/components/pages/profile/home-link";
import SettingsIcon from "@/components/pages/profile/settings-icon";
import ProfileInfo from "@/components/pages/profile/profile-info";
import BlocksStats from "@/components/pages/profile/block-stats/block-stats";

/* Context */
import { AuthProvider } from "@/context/auth-context";

const ProfilePage = () => {

    return <>
        <div className={styles["main-container"]}>
            <div className={styles["content-account-container"]}>
                <div className={styles["links-container"]}>
                    <HomeLink />
                    <SettingsIcon />
                </div>
                <AuthProvider>
                    <div className={styles["profile-info-container"]}>
                        <ProfileInfo />
                    </div>
                    <div className={styles["divisor-line-container"]}>
                        <div className={styles["divisor-line"]}></div>
                    </div>
                    <div className={styles["stats-container"]}>
                        <h2>Resumen</h2>
                        <div className={styles["blocks-stats-container"]}>
                            <BlocksStats />
                        </div>
                    </div>
                </AuthProvider>
                <div className={styles["terms-and-conditions"]}>
                    <Link href="/terminos-y-condiciones">Terminos y condiciones legales</Link>
                </div>
            </div>
        </div>
    </>
}

export default ProfilePage;