import React, { useState, useMemo, useEffect } from 'react';
import { Student, ABCAnalysisData, ABCAnalysis } from './types';
import Header from './components/Header';
import StudentManager from './components/StudentManager';
import AnalysisForm from './components/AnalysisForm';
import FeedbackDisplay from './components/FeedbackDisplay';
import AnalysisHistoryList from './components/AnalysisHistoryList';
import PastAnalysisViewer from './components/PastAnalysisViewer';
import LoginScreen from './components/LoginScreen';
import { getAIFeedback } from './services/geminiService';
import { SparklesIcon } from './components/icons';
import Modal from './components/Modal';

const App: React.FC = () => {
    // ログイン状態の管理
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // 既存の状態管理
    const [students, setStudents] = useState<Student[]>(() => {
        try {
            const savedStudents = localStorage.getItem('abc-students');
            if (savedStudents) {
                const parsedStudents = JSON.parse(savedStudents);
                return parsedStudents.map((student: Student) => ({
                    ...student,
                    createdAt: new Date(student.createdAt),
                    analyses: student.analyses.map(a => ({...a, date: new Date(a.date)}))
                }));
            }
            return [];
        } catch (error) {
            console.error('Failed to parse students from localStorage', error);
            return [];
        }
    });

    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [analysisKey, setAnalysisKey] = useState<number>(0);
    const [viewingAnalysisId, setViewingAnalysisId] = useState<string | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
    const [isStudentDeleteModalOpen, setStudentDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

    // ログイン状態の初期化
    useEffect(() => {
        const savedLoginState = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(savedLoginState === 'true');
        setIsCheckingAuth(false);
    }, []);

    // 学生データの保存
    useEffect(() => {
        if (isLoggedIn) {
            try {
                localStorage.setItem('abc-students', JSON.stringify(students));
            } catch (error) {
                console.error('Failed to save students to localStorage', error);
            }
        }
    }, [students, isLoggedIn]);

    // ログイン処理
    const handleLogin = async (password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error || 'ログインに失敗しました' };
            }
        } catch (error) {
            console.error('ログインエラー:', error);
            return { success: false, error: 'ネットワークエラーが発生しました' };
        }
    };

    // ログアウト処理
    const handleLogout = () => {
        if (window.confirm('ログアウトしますか？')) {
            setIsLoggedIn(false);
            localStorage.removeItem('isLoggedIn');
            // 状態をリセット
            setSelectedStudentId(null);
            setFeedback('');
            setError('');
            setViewingAnalysisId(null);
            setAnalysisKey(0);
        }
    };

    const selectedStudent = useMemo(() => {
        return students.find(s => s.id === selectedStudentId) || null;
    }, [students, selectedStudentId]);

    const viewingAnalysis = useMemo(() => {
        if (!selectedStudent || !viewingAnalysisId) return null;
        return selectedStudent.analyses.find(a => a.id === viewingAnalysisId) || null;
    }, [selectedStudent, viewingAnalysisId]);

    const handleAddStudent = (name: string, grade: string, studentClass: string) => {
        const newStudent: Student = {
            id: `student-${Date.now()}`,
            name,
            grade,
            class: studentClass,
            createdAt: new Date(),
            analyses: [],
        };
        setStudents(prev => [...prev, newStudent]);
        setSelectedStudentId(newStudent.id);
        setViewingAnalysisId(null);
    };
    
    const handleSelectStudent = (id: string | null) => {
        setSelectedStudentId(id);
        setViewingAnalysisId(null);
        handleReset();
    };

    const handleDeleteStudent = (id: string) => {
        setStudentToDelete(id);
        setStudentDeleteModalOpen(true);
    };

    const confirmDeleteStudent = () => {
        if (!studentToDelete) return;

        const nextStudents = students.filter(s => s.id !== studentToDelete);
        setStudents(nextStudents);
        
        if (selectedStudentId === studentToDelete) {
            const nextStudent = nextStudents.length > 0 ? nextStudents[0] : null;
            handleSelectStudent(nextStudent ? nextStudent.id : null);
        }

        setStudentDeleteModalOpen(false);
        setStudentToDelete(null);
    };
    
    const handleGetFeedback = async (analysisData: ABCAnalysisData) => {
        if (!selectedStudent) {
            setError('フィードバックを取得する児童を選択してください。');
            return;
        }
        setIsLoading(true);
        setFeedback('');
        setError('');
        try {
            const result = await getAIFeedback({ name: selectedStudent.name, grade: selectedStudent.grade }, analysisData);
            setFeedback(result);

            const newAnalysis: ABCAnalysis = {
                id: `analysis-${Date.now()}`,
                studentId: selectedStudent.id,
                date: new Date(),
                ...analysisData,
                aiFeedback: {
                    provider: 'gemini',
                    suggestions: result,
                    timestamp: new Date(),
                },
            };

            setStudents(prevStudents => 
                prevStudents.map(student =>
                    student.id === selectedStudent.id
                        ? { ...student, analyses: [newAnalysis, ...(student.analyses || [])] }
                        : student
                )
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました。';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setFeedback('');
        setError('');
        setAnalysisKey(prev => prev + 1);
    };

    const handleReturnToNew = () => {
        setViewingAnalysisId(null);
        handleReset();
    };

    const handleSelectAnalysis = (analysisId: string) => {
        setViewingAnalysisId(analysisId);
        handleReset();
    };
    
    const handleDeleteAnalysis = (analysisId: string) => {
        if (!selectedStudentId) return;
        setAnalysisToDelete(analysisId);
        setDeleteModalOpen(true);
    };
    
    const confirmDeleteAnalysis = () => {
        if (!analysisToDelete || !selectedStudentId) return;

        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.id === selectedStudentId) {
                    return {
                        ...student,
                        analyses: student.analyses.filter(a => a.id !== analysisToDelete),
                    };
                }
                return student;
            })
        );
        
        if (viewingAnalysisId === analysisToDelete) {
            setViewingAnalysisId(null);
        }

        setDeleteModalOpen(false);
        setAnalysisToDelete(null);
    };

    // 認証チェック中
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // ログインしていない場合
    if (!isLoggedIn) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    // メインアプリケーション
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header onLogout={handleLogout} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                    <StudentManager
                        students={students}
                        selectedStudentId={selectedStudentId}
                        onSelectStudent={handleSelectStudent}
                        onAddStudent={handleAddStudent}
                        onDeleteStudent={handleDeleteStudent}
                    />
                </div>

                {selectedStudent && (
                    <AnalysisHistoryList 
                        analyses={selectedStudent.analyses || []}
                        onSelect={handleSelectAnalysis}
                        onDelete={handleDeleteAnalysis}
                        currentViewingId={viewingAnalysisId}
                    />
                )}

                {selectedStudent ? (
                    viewingAnalysis ? (
                        <PastAnalysisViewer 
                            analysis={viewingAnalysis}
                            student={selectedStudent}
                            onBack={handleReturnToNew}
                        />
                    ) : (
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                               <AnalysisForm
                                    key={analysisKey}
                                    onSubmit={handleGetFeedback}
                                    isLoading={isLoading}
                                />
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mt-8 lg:mt-0">
                                <FeedbackDisplay
                                    feedback={feedback}
                                    isLoading={isLoading}
                                    error={error}
                                    onReset={handleReturnToNew}
                                    hasAnalysisStarted={!!feedback || isLoading || !!error}
                                />
                            </div>
                        </div>
                    )
                ) : (
                    <div className="mt-8 text-center bg-white p-10 rounded-2xl shadow-lg border border-slate-200">
                        <SparklesIcon className="w-16 h-16 mx-auto text-teal-500 mb-4" />
                        <h2 className="text-xl font-bold text-slate-700">はじめに</h2>
                        <p className="text-slate-500 mt-2">上の「＋ 児童を追加」ボタンから分析対象の児童を登録してください。</p>
                    </div>
                )}
            </main>
            <footer className="text-center p-4 text-sm text-slate-400">
                <p>AI ABC Analysis Assistant v1.4.0</p>
            </footer>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setAnalysisToDelete(null);
                }}
                title="分析記録の削除"
            >
                <div className="space-y-4">
                    <p className="text-slate-700">この分析記録を本当に削除しますか？この操作は取り消せません。</p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setAnalysisToDelete(null);
                            }}
                            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={confirmDeleteAnalysis}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            削除する
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={isStudentDeleteModalOpen}
                onClose={() => {
                    setStudentDeleteModalOpen(false);
                    setStudentToDelete(null);
                }}
                title="児童情報の削除"
            >
                <div className="space-y-4">
                    <p className="text-slate-700">この児童の情報を本当に削除しますか？<br/>関連する分析データもすべて失われ、この操作は取り消せません。</p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setStudentDeleteModalOpen(false);
                                setStudentToDelete(null);
                            }}
                            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={confirmDeleteStudent}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            削除する
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default App;