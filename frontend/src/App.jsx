import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdMapsHomeWork } from "react-icons/md";

function App() {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [currentCard, setCurrentCard] = useState({ id: null, title: '', description: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/cards')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => setCards(data))
      .catch(error => setError(error.message));
  }, []);

  const filteredCards = searchTerm.length >= 3
    ? cards.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cards;

  const handleInputChange = (e) => {
    setCurrentCard({ ...currentCard, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isEditing
      ? `http://localhost:4000/cards/${currentCard.id}`
      : 'http://localhost:4000/cards';

    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: currentCard.title, description: currentCard.description }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (isEditing) {
          setCards(cards.map(card => (card.id === currentCard.id ? data : card)));
        } else {
          setCards([...cards, data]);
        }
        setCurrentCard({ id: null, title: '', description: '' });  // Clear the form
        setIsModalOpen(false);  // Close the modal after adding/updating the card
        setIsEditing(false);  // Reset editing state
      })
      .catch(error => setError(error.message));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/cards/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        setCards(cards.filter(card => card.id !== id));  // Remove the card from the state
      })
      .catch(error => setError(error.message));
  };

  const openModal = (card = { id: null, title: '', description: '' }) => {
    setCurrentCard(card);
    setIsEditing(Boolean(card.id));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="flex justify-between items-center p-6 bg-black text-white">
        <div className="text-lg font-bold flex items-center gap-2"> <MdMapsHomeWork  className='text-2xl'/> Abstract | Help Center</div>
        <button className="bg-black border border-lg border-gray-200 text-white px-4 py-2 rounded-lg">Submit a request</button>
      </header>

      <main className="flex flex-col items-center justify-center bg-[#E1E1F9] text-center p-6 py-20 font-thin">
        <h1 className="text-5xl font-light">How can we help?</h1>

        <div className="mt-6 mb-10 w-fit flex justify-center border border-black rounded-sm">
          <input
            type="text"
            placeholder="Type minimum 3 characters to Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-96"
          />
          <button className="px-4 py-2 bg-white">→</button>
        </div>

        {error && <div className="text-red-500 mb-6">{error}</div>}
        {!error && searchTerm.length >= 3 && filteredCards.length === 0 && (
          <div className="text-gray-700 mb-6">No cards found for "{searchTerm}"</div>
        )}
      </main>

      <section className="p-20 flex flex-col items-center justify-center">
        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-4" onClick={() => openModal()}>Add New Card</button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-3/4">
          {filteredCards.map(card => (
            <div key={card.id} className="bg-white rounded-lg text-left border border-gray-200 relative">
             
             <div>
             <button
                onClick={() => openModal(card)}
                className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
              >
               <FaRegEdit className='text-2xl'/>
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="absolute top-2 right-10 text-red-500 hover:text-red-700"
              >
               <MdDelete  className='text-2xl'/>
              </button>              </div>
              <h2 className="text-lg font-semibold mb-2 border-b p-3 border-gray-200">{card.title}</h2>
              <p className="text-gray-600 p-3">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-black text-white p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Abstract</h4>
          <p>Branches</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Resources</h4>
          <p>Blog</p>
          <p>Help Center</p>
          <p>Release Notes</p>
          <p>Status</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Community</h4>
          <p>Twitter</p>
          <p>LinkedIn</p>
          <p>Facebook</p>
          <p>Dribbble</p>
          <p>Podcast</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <p>About Us</p>
          <p>Careers</p>
          <p>Legal</p>
        </div>
      </footer>

      {/* Modal for adding/editing a card */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Card' : 'Add a New Card'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={currentCard.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={currentCard.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {isEditing ? 'Update Card' : 'Add Card'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
