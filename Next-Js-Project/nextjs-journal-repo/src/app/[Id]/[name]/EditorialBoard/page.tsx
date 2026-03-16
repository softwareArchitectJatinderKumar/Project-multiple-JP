"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import JournalMenuBar from '@/component/TopMenubar/JournalMenuBar';
import JournalInnerMenu from '@/component/JournalInnerMenuComponent/JournalInnerMenuComponent';
import styles from './JournalEditorBoard.module.css';

// 1. Define the structure of an Editor
interface Editor {
    editorName: string;
    designation?: string;
    editorDesignation?: string;
    editorAddress: string;
    email: string;
    journalId: string;
    editorType: string;
}

// 2. Define the structure of your grouped state
interface EditorState {
    editorInChief: Editor[];
    managingEditor: Editor[];
    associateEditor: Editor[];
    nationalBoard: Editor[];
    internationalBoard: Editor[];
    reviewers: Editor[];
}

export default function JournalEditorBoard() {
    const params = useParams();
    const router = useRouter();
    
    // State management
    const [isLoading, setIsLoading] = useState(true);
    const [journalTitle, setJournalTitle] = useState("");
    // const [editors, setEditors] = useState({
    //     editorInChief: [],
    //     managingEditor: [],
    //     associateEditor: [],
    //     nationalBoard: [],
    //     internationalBoard: [],
    //     reviewers: []
    // });

    const [editors, setEditors] = useState<EditorState>({
        editorInChief: [],
        managingEditor: [],
        associateEditor: [],
        nationalBoard: [],
        internationalBoard: [],
        reviewers: []
    });

    const bookId = params?.Id as string;
    const rawName = params?.name as string;

    const prioritizeByDesignation = useCallback((editorList: any[]) => {
        const importantRoles = ["head", "dean", "associate dean", "associate professor", "assistant professor"];
        
        const getPriority = (designation: string = "") => {
            const desc = designation.toLowerCase();
            for (let i = 0; i < importantRoles.length; i++) {
                if (desc.includes(importantRoles[i])) return i + 1;
            }
            return importantRoles.length + 1;
        };

        return [...editorList].sort((a, b) => getPriority(a.designation) - getPriority(b.designation));
    }, []);

    const fetchData = useCallback(async () => {
        if (!bookId) return;
        
        setIsLoading(true);
        try {
            if (rawName) setJournalTitle(rawName.replace(/-/g, ' '));

            const response = await myAppWebService.GetAllJournalEditorsDetails();
            const data = response?.item1 || [];

            if (data.length > 0) {
                const filtered = data.filter((item: any) => item.journalId === bookId);
                
                if (filtered.length === 0) {
                    router.push('/');
                    return;
                }

                const filterByType = (typeStr: string) => 
                    filtered.filter((item: any) => item.editorType.toLowerCase().includes(typeStr.toLowerCase()));

                setEditors({
                    editorInChief: filterByType('editor in chief'),
                    managingEditor: prioritizeByDesignation(filterByType('managing editor')),
                    associateEditor: prioritizeByDesignation(filterByType('associate editors')),
                    nationalBoard: filterByType('editorial board members national'),
                    internationalBoard: filterByType('editorial board members international'),
                    reviewers: prioritizeByDesignation(filterByType('reviewers'))
                });
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error("Error fetching editors:", error);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    }, [bookId, rawName, router, prioritizeByDesignation]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const EditorSection = ({ title, data, id, isDefaultOpen = false }: any) => (
        <div className="accordion-item">
            <h2 className="accordion-header fs-2" id={`heading${id}`}>
                <button 
                    className={`accordion-button fs-2 ${styles.accordionColor} ${!isDefaultOpen ? 'collapsed' : ''}`} 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#collapse${id}`}
                >
                    {title}
                </button>
            </h2>
            <div 
                id={`collapse${id}`} 
                className={`accordion-collapse collapse ${isDefaultOpen ? 'show' : ''}`} 
                data-bs-parent="#editorialAccordion"
            >
                <div className={`accordion-body ${styles.accordionColor}`}>
                    {data && data.length > 0 ? (
                        <div className="row">
                            {data.map((editor: any, index: number) => (
                                <div className="col-md-6 mb-4" key={index}>
                                    <div className={styles.sectPresident}>
                                        <h3 className="fw-bold fs-5">{editor.editorName}</h3>
                                        <h4 className="text-secondary fs-6">{editor.designation || editor.editorDesignation}</h4>
                                        <div dangerouslySetInnerHTML={{ __html: editor.editorAddress }} className="mt-2" />
                                        <p className="mt-1">
                                            <strong>Email: </strong> 
                                            <a href={`mailto:${editor.email}`} className="text-decoration-none">{editor.email}</a>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="fs-6 text-danger text-center">No Record Found!</p>
                    )}
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <span className="text-danger fs-3 mb-4">Loading Data ..</span>
                <div className="spinner-grow text-danger" style={{ width: '10rem', height: '10rem' }} role="status" />
            </div>
        );
    }

    return (
        <>
            <JournalMenuBar />
            <JournalInnerMenu />
            <section className="py-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="main-heading">
                                <h1 className="fw-bold">{journalTitle}</h1>
                            </div>
                            <div className="sub-heading border-bottom pb-2">
                                <h3 className="text-muted">Editorial Board</h3>
                            </div>
                        </div>
                    </div>

                    <div className="accordion accordion-flush shadow-sm" id="editorialAccordion">
                        <EditorSection title="Editor in Chief" data={editors.editorInChief} id="One" isDefaultOpen={true} />
                        <EditorSection title="Managing Editor" data={editors.managingEditor} id="Two" />
                        <EditorSection title="Associate Editors" data={editors.associateEditor} id="Three" />
                        <EditorSection title="Editorial board members National" data={editors.nationalBoard} id="Four" />
                        <EditorSection title="Editorial board members International" data={editors.internationalBoard} id="Five" />
                    </div>
                </div>
            </section>
        </>
    );
}