import LogoImg from "@/resources/logo.webp";
import styles from "@/styles/components/logo.module.scss";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/" className={styles["logo-container"]}>
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