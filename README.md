**ASHA AI CHATBOT**
Features Offered
•	Job Listings: Provides information on job opportunities in fields like web development, blockchain, and more, including company names, locations, and application links.
•	Mentorship Programs: Introduces multiple mentorship initiatives, such as Women in Clean Tech & Sustainability and Women in Energy, detailing program focuses, formats, and application details.
•	Legal Rights Information: Offers insights into legal rights such as crisis support for women in India, right against domestic violence, right to equal pay, right to free legal aid, right to protection against harassment at the workplace, right to maternity benefits, right to abortion, right to inheritance and property, and more.
•	Women Empowerment Insights: Shares statistics and benefits of women's empowerment across various aspects like gender diversity in the workplace, women in STEM, education for girls, women in leadership, economic empowerment, health outcomes, and political participation.
•	Community Events and Sessions: Informs users about upcoming community events and sessions, including event names, locations, dates, and details.
•	Frequently Asked Questions (FAQs): Addresses common questions related to women's empowerment, job opportunities, mentorship programs, legal rights, and mor

Tech stacks used:
Front-end: 1. HTML5 * Semantic elements including <video>, <div>, <form>, <input>, <select>, <button> * Used for structuring both the chatbot interface and login/signup pages 
2. CSS * Inline styling via <style> tags * Features include: * Layout design * Color schemes and gradients * Responsive design elements * Hover effects 
3. JavaScript (Client-side) * User input handling * Real-time message processing * Form validation including: * Password strength validation * Password matching confirmation * Form submission validation * Client-side redirection 
4. Socket.IO Client * Loaded from CDN: https://cdn.socket.io/4.5.4/socket.io.min.js * Establishes real-time communication with the backend * Connected to localhost on port 3000
 5. Video Elements * Looping video backgrounds on the interface 
Backend Technologies 
1. Node.js * Server-side JavaScript runtime environment * Package management via npm (evidenced by node_modules and package-lock.json) 
2. Express.js * Web application framework for routing and HTTP handling * Serves static files from the Frontend directory 
3. Socket.IO (Server) * Real-time bidirectional communication * Includes related packages: * socket.io-adapter * socket.io-parser * engine.io 
4. Axios * Promise-based HTTP client * Used for making external API requests (specifically mentioned for Adzuna API) 
5. Additional Node.js Packages 
* body-parser: Parses incoming request bodies 
* cors: Enables Cross-Origin Resource Sharing 
* dotenv: Loads environment variables from .env files 
* debug: For logging and debugging 
* http-errors: Creates HTTP error objects 
* mime-types and mime-db: For handling file types and MIME types 
* ws: WebSocket support (leveraged by Socket.IO) 
* form-data: For handling form submissions 
* Various utility packages: safe-buffer, qs, inherits, object-assign, etc. 
6. Node.js Core Modules 
* http: Creates the server 
* path: Handles and resolves file paths
