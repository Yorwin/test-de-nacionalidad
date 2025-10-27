// loading.tsx
import './loading.scss';

export default function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring spinner-ring--animated"></div>
                </div>
                <p className="loading-text">Cargando...</p>
            </div>
        </div>
    );
}