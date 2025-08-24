
import React, { useState } from 'react';
import { Student } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, ChevronDownIcon } from './icons';

interface StudentManagerProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelectStudent: (id: string | null) => void;
  onAddStudent: (name: string, grade: string, studentClass: string) => void;
  onDeleteStudent: (id: string) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');
  
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleAdd = () => {
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim(), newStudentGrade.trim(), newStudentClass.trim());
      setNewStudentName('');
      setNewStudentGrade('');
      setNewStudentClass('');
      setModalOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent dropdown from closing
    onDeleteStudent(id);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <select
            value={selectedStudentId || ''}
            onChange={(e) => onSelectStudent(e.target.value || null)}
            className="w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md appearance-none shadow-sm bg-white"
            disabled={students.length === 0}
            aria-label="児童を選択"
          >
            <option value="" disabled>児童を選択してください</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.grade || '未設定'})
              </option>
            ))}
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-5 w-5" />
            </div>
        </div>
        
        {selectedStudent && (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 p-2 rounded-md">
             <span className="font-semibold">選択中の児童: {selectedStudent.name}</span>
             <button onClick={(e) => handleDelete(e, selectedStudent.id!)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors" aria-label={`${selectedStudent.name}を削除`}>
                <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        <button
          onClick={() => setModalOpen(true)}
          className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          児童を追加
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="新規児童の追加">
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">児童名 (必須)</label>
            <input
              type="text"
              id="studentName"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white text-slate-900 placeholder:text-slate-400"
              placeholder="例：山田 太郎"
              required
            />
          </div>
          <div>
            <label htmlFor="studentGrade" className="block text-sm font-medium text-gray-700">学年</label>
            <input
              type="text"
              id="studentGrade"
              value={newStudentGrade}
              onChange={(e) => setNewStudentGrade(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white text-slate-900 placeholder:text-slate-400"
              placeholder="例：小学3年生"
            />
          </div>
          <div>
            <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700">クラス</label>
            <input
              type="text"
              id="studentClass"
              value={newStudentClass}
              onChange={(e) => setNewStudentClass(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white text-slate-900 placeholder:text-slate-400"
              placeholder="例：1組"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!newStudentName.trim()}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              追加する
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default StudentManager;
