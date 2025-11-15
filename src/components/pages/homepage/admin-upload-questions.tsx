"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { uploadQuestions, db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const AdminUploadQuestions = () => {
  const { user } = useAuth();
  const [jsonText, setJsonText] = useState("");
  const [selectedModule, setSelectedModule] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsAdmin(data.isAdmin === true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking admin:", error);
          setIsAdmin(false);
        } finally {
          setChecking(false);
        }
      };
      checkAdmin();
    } else {
      setIsAdmin(false);
      setChecking(false);
    }
  }, [user]);

  if (checking) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  const handleUpload = async () => {
    if (!jsonText.trim()) {
      setMessage("Por favor, ingresa el JSON.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const questions = JSON.parse(jsonText);
      if (!Array.isArray(questions)) {
        throw new Error("El JSON debe ser un array de preguntas.");
      }
      await uploadQuestions(selectedModule, questions);
      setMessage("Preguntas subidas exitosamente.");
      setJsonText("");
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Subir Preguntas (Admin)</h3>
      <label>Seleccionar Módulo:</label>
      <select value={selectedModule} onChange={(e) => setSelectedModule(Number(e.target.value))} style={{ marginBottom: "10px", marginLeft: "10px" }}>
        <option value={1}>Módulo 1</option>
        <option value={2}>Módulo 2</option>
        <option value={3}>Módulo 3</option>
        <option value={4}>Módulo 4</option>
        <option value={5}>Módulo 5</option>
      </select>
      <br />
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder="Pega el JSON de preguntas aquí..."
        rows={10}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Subiendo..." : "Subir Preguntas"}
      </button>
      {message && <p style={{ marginTop: "10px", color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
    </div>
  );
};

export default AdminUploadQuestions;