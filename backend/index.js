const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Help Center API!');
});

// In-memory array to store cards
let cards = [
    {
      id: '1',
      title: 'Account Management',
      description: 'Learn how to manage your account settings, update your profile, and manage your subscription.'
    },
    {
      id: '2',
      title: 'Billing and Payments',
      description: 'Get help with billing issues, payment methods, and understanding your invoices.'
    },
    {
      id: '3',
      title: 'Privacy and Security',
      description: 'Understand our privacy policies, how we protect your data, and steps to secure your account.'
    },
    {
      id: '4',
      title: 'Using the Product',
      description: 'Explore how to use our product effectively, including tips and tutorials.'
    },
    {
      id: '5',
      title: 'Troubleshooting',
      description: 'Find solutions to common problems and learn how to fix issues quickly.'
    }
  ];
  

// Create a new card with validation
app.post('/cards', (req, res) => {
    const { title, description } = req.body;

    // Basic validation
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    // Create new card
    const newCard = { id: Date.now().toString(), title, description };
    cards.push(newCard);
    res.status(201).json(newCard);
});

app.delete('/cards/:id', (req, res) => {
    const cardIndex = cards.findIndex(c => c.id === req.params.id);
    if (cardIndex === -1) {
        return res.status(404).json({ error: 'Card not found' });
    }
    cards.splice(cardIndex, 1);
    res.status(204).send(); 
});

app.put('/cards/:id', (req, res) => {
    const cardIndex = cards.findIndex(c => c.id === req.params.id);
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }
  
    const { title, description } = req.body;
    cards[cardIndex] = { id: req.params.id, title, description };
    res.json(cards[cardIndex]);
  });
  



app.get('/cards', (req, res) => {
    res.json(cards);
});


app.get('/cards/:title', (req, res) => {
    const card = cards.find(c => c.title.toLowerCase() === req.params.title.toLowerCase());
    if (!card) {
        return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// General error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);  
    res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
