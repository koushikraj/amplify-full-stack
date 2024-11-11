import React, { useState } from 'react';

type Flashcard = {
  title: string;
  description: string;
  details: string;
};

type Resource = {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  flashcards: Flashcard[];
};

const resources: Resource[] = [
  {
    id: 1,
    title: "CSCI 152 - SOLID Principles",
    description: "Just a short list of flashcards for some software engineering principles. Hope these help you in your studies!",
    createdBy: "ecast96@mail.fresnostate.edu",
    flashcards: [],
  },
  {
    id: 2,
    title: "CSCI 152 - Final a",
    description: "Final study materials.",
    createdBy: "ecast96@mail.fresnostate.edu",
    flashcards: [],
  },
];

const Flashcard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddFlashcard = () => {
    const newFlashcard: Flashcard = {
      title,
      description,
      details,
    };
    setFlashcards([...flashcards, newFlashcard]);
    setTitle("");
    setDescription("");
    setDetails("");
    setIsModalOpen(false);
  };

  return (
    <div style={styles.container}>
      <button style={styles.createFlashcardsButton} onClick={handleOpenModal}>
        Create Flashcards
      </button>

      {/* Flashcard Creation Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Create a Flashcard</h2>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              style={styles.input}
            />
            <label style={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={styles.textarea}
            />
            <label style={styles.label}>Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add Note Cards"
              style={styles.textarea}
            />
            <div style={styles.buttonContainer}>
              <button onClick={handleCloseModal} style={styles.cancelButton}>Cancel</button>
              <button onClick={handleAddFlashcard} style={styles.submitButton}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  createFlashcardsButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  label: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minHeight: '80px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    border: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Flashcard;
