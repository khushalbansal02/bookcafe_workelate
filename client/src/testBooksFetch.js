// Run this with: node testBooksFetch.js
fetch('http://localhost:5000/books')
  .then(res => res.json())
  .then(data => {
    console.log('Books:', data.books);
    if (data.books && data.books.length > 0) {
      data.books.forEach(book => console.log('Book _id:', book._id));
    } else {
      console.log('No books found!');
    }
  })
  .catch(err => console.error('Error fetching books:', err));
