import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
const Url = import.meta.env.VITE_BACKEND_URL;

const SubmissionView = () => {
    const { submissionId } = useParams();
    const [fileUrl, setFileUrl] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [textContent, setTextContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${Url}/api/submission/file/${submissionId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const contentType = response.headers.get("content-type");
                const blob = await response.blob();
                
                if (blob.size === 0) {
                    throw new Error('Empty file received');
                }
                
                const url = URL.createObjectURL(blob);

                setFileUrl(url);
                setFileType(contentType);

                // For text files, read the content directly
                if (contentType && contentType.startsWith("text/plain")) {
                    const text = await blob.text();
                    setTextContent(text);
                }
            } catch (error) {
                console.error("Error loading submission file:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (submissionId) {
            fetchFile();
        }

        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [submissionId]);

    // Custom error renderer for PDF
    const renderError = (error) => {
        let message = '';
        switch (error.name) {
            case 'InvalidPDFException':
                message = 'The document is invalid or corrupted';
                break;
            case 'MissingPDFException':
                message = 'The document is missing';
                break;
            case 'UnexpectedResponseException':
                message = 'Unexpected server response';
                break;
            default:
                message = 'Cannot load the document';
                break;
        }
        return (
            <div style={{
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
            }}>
                <div style={{
                    backgroundColor: '#e53e3e',
                    borderRadius: '0.25rem',
                    color: '#fff',
                    padding: '0.5rem',
                }}>
                    {message}
                </div>
            </div>
        );
    };

    const renderFile = () => {
        if (loading) {
            return <p>Loading file...</p>;
        }

        if (error) {
            return (
                <div style={{ color: 'red', padding: '20px' }}>
                    <h3>Error loading file:</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            );
        }

        if (!fileUrl || !fileType) {
            return <p>No file data available</p>;
        }

        // Handle PDF files
        if (fileType === "application/pdf") {
            return (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <div style={{ height: "80vh" }}>
                        <Viewer 
                            fileUrl={fileUrl}
                            renderError={renderError}
                            onDocumentLoadSuccess={() => console.log('PDF loaded successfully')}
                        />
                    </div>
                </Worker>
            );
        }

        // Handle text files (this is what should render for your file)
        if (fileType && fileType.startsWith("text/plain")) {
            return (
                <div style={{ 
                    width: "100%", 
                    height: "80vh", 
                    border: "1px solid #ccc", 
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    overflow: "auto",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                    lineHeight: "1.5"
                }}>
                    {textContent || "Loading text content..."}
                </div>
            );
        }

        return <p>Unsupported file type: {fileType}</p>;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Viewing Submission: {submissionId}</h2>
            
            
            
            {renderFile()}
        </div>
    );
};

export default SubmissionView;
