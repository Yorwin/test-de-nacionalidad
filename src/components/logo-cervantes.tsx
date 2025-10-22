import LogoImg from "@/resources/logo-instituto-cervantes.png"
import styles from "@/styles/components/logo.module.scss"
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href="https://cervantes.org" target="_blank" className={styles["logo-container"]}>
            <Image
                alt="Logo"
                src={LogoImg}
                className={styles["logo"]}
                sizes="25vw"
                fill
            />
        </Link>
    )
};

export default Logo;