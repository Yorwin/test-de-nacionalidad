import styles from '@/styles/components/generic-title.module.scss';

interface Props {
    titulo: string;
};

const TituloGenerico = ({ titulo }: Props) => {
    return <h1 className={styles["titulo"]}>{titulo}</h1>
};

export default TituloGenerico;