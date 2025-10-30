const SpinningElement = () => {
    return <>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "5vh" }}>
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    </>
};

export default SpinningElement;