import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
    const bookTitle = req.query.bookTitle;
    let bookData = [];

    if (bookTitle) {
        try {
            // Fetch books with relevance sorting
            const response = await axios.get(`https://openlibrary.org/search.json`, {
                params: {
                    q: bookTitle, // General search query
                    limit: 20 // Limit results
                }
            });

            // console.log("API Response:", response.data); // Debugging log

            // Filter results to include only books with at least one ISBN
             bookData = response.data.docs;
             topBook = bookData.find(book => book.isbn || book.cover_edition_key); // Get first book with a cover
            res.render("home", { books: topBook ? [topBook] : [] });
            


           
        } catch (error) {
            console.error('Error fetching book data:', error.message);
        }
    }

    // Render home.ejs with book data
    res.render('home', { books: bookData });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

  