import styles from "@/styles/layout/terminos-y-condiciones/terminos-y-condiciones.module.scss";

const textBlockItem = ({ number, title, text }: { number: number, title: string, text: string }) => {
    return (
        <section className={styles["section"]}>
            <h2>{number} - {title}</h2>
            <p>{text}</p>
        </section>
    )
};

export default textBlockItem;