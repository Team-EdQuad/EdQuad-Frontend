import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const SubmissionView = () => {
    const { submissionId } = useParams();
    const [fileUrl, setFileUrl] = useState(null);
    const [fileType, setFileType] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/submission/file/${submissionId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch file");
                }

                const contentType = response.headers.get("content-type");
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                setFileUrl(url);
                setFileType(contentType);
            } catch (error) {
                console.error("Error loading submission file:", error);
            }
        };

        fetchFile();
    }, [submissionId]);

    const renderFile = () => {
        if (!fileUrl || !fileType) {
            return <p>Loading file...</p>;
        }

        if (fileType === "application/pdf") {
            return (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">

                    <div style={{ height: "80vh" }}>
                        <Viewer fileUrl={fileUrl} />
                    </div>
                </Worker>
            );
        }

        if (fileType === "text/plain") {
            return (
                <iframe
                    src={fileUrl}
                    title="Text Viewer"
                    style={{ width: "100%", height: "80vh", border: "none" }}
                />
            );
        }

        return <p>Unsupported file type.</p>;
    };

    return (
        <div>
            <h2>Viewing Submission: {submissionId}</h2>
            {renderFile()}
        </div>
    );
};

export default SubmissionView;
