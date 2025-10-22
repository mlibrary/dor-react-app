import React, { useState, useEffect } from "react";
import { ReactiveBase } from '@appbaseio/reactivesearch';

function BookList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data directly from the Elasticsearch endpoint
        fetch('https://appbase-demo-ansible-abxiydt-arc.searchbase.io/good-books-ds/_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61')
            },
            body: JSON.stringify({
                size: 10,
                query: { match_all: {} }
            })
        })
            .then(res => res.json())
            .then(data => {
                setBooks(data.hits.hits);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching books:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading books...</p>;

    return (
        <div>
            <h2>Books from Database:</h2>
            {books.map((book) => (
                <div key={book._id} style={{
                    marginBottom: '15px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                }}>
                    <h3>{book._source.original_title}</h3>
                    <p><strong>Author:</strong> {book._source.authors}</p>
                    <p><strong>Rating:</strong> {book._source.average_rating} ⭐</p>
                    <p><strong>Published:</strong> {book._source.original_publication_year}</p>
                </div>
            ))}
        </div>
    );
}

function App() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Book Search Demo 📚</h1>
            <ReactiveBase
                app="good-books-ds"
                url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
                credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
            >
                <BookList />
            </ReactiveBase>
        </div>
    );
}

export default App;
