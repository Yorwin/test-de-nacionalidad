import LogoImg from "@/resources/logo-instituto-cervantes.png"
import styles from "@/styles/components/logo.module.scss"
import Image from "next/image";

const Logo = () => {
    return <>
        <a href="https://cervantes.org" target="_blank" className={styles["logo-container"]}>
            <Image
                alt="Logo"
                src={LogoImg}
                className={styles["logo"]}
                fill
            />
        </a>
    </>
};

export default Logo;