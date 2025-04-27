require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const mentorshipPrograms = require('./mentorship_programs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname, 'Frontend'))); // Serve static files from the "Frontend" directory
// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

const APP_ID = process.env.APP_ID; // Load from .env
const APP_KEY = process.env.APP_KEY; // Load from .env

// Function to fetch jobs from Adzuna API
async function fetchJobs(query) {
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=5&what=${query}`;
  try {
    const response = await axios.get(url);
    const jobs = response.data.results.map(job => ({
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      link: job.redirect_url
    }));
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

//Data for community events and sessions
const eventsData = {
  music: [
    {
      name: 'Bryan Adams "Roll With The Punches" Tour',
      date: 'October 2025',
      location: 'North America',
      details: 'Co-headlining with Pat Benatar and Neil Giraldo, including a performance at Madison Square Garden on October 30.'
    },
    {
      name: 'Lana Del Rey at Stagecoach Festival',
      date: 'April 2025',
      location: 'Indio, California, USA',
      details: 'Lana Del Rey performed at the Stagecoach country music festival, marking her continued exploration into the country genre.'
    },
    {
      name: 'All Things Go Festival',
      date: 'September 26–28, 2025',
      location: 'Forest Hills Stadium, New York City, USA',
      details: 'Features 24 musical acts including Doechii, Clairo, Lucy Dacus, and The Marías.'
    },
    {
      name: 'Tampa Bay Concerts',
      date: 'Throughout 2025',
      location: 'Tampa Bay, Florida, USA',
      details: 'Performances by Stevie Nicks (August 30), Ice Cube (September 11), and K-pop star Jin (July 26–27).'
    },
    {
      name: 'Fito & Fitipaldis "Aullidos Tour"',
      date: 'November 2025 – May 2026',
      location: '28 cities across Spain',
      details: 'The tour includes a performance in Alicante on March 6, 2026.'
    },
    {
      name: 'WOMADelaide Festival',
      date: 'March 2026',
      location: 'Adelaide, Australia',
      details: 'A four-day festival celebrating music, arts, and dance from around the world.'
    },
    {
      name: 'Iron Maiden "Run For Your Lives" World Tour',
      date: 'May 27, 2025 – August 2, 2025',
      location: 'Europe',
      details: 'A 32-show tour across Europe, marking their first tour without longtime drummer Nicko McBrain.'
    },
    {
      name: 'James Blunt "Back to Bedlam" 20th Anniversary Tour',
      date: 'February 11 – October 30, 2025',
      location: 'Global',
      details: 'Celebrating the 20th anniversary of his debut album with a global tour.'
    },
    {
      name: 'Primavera Sound 2025',
      date: 'June 5–7, 2025',
      location: 'Barcelona, Spain',
      details: 'Headliners include Charli XCX, Sabrina Carpenter, and Chappell Roan.'
    },
    {
      name: 'Glastonbury Festival 2025',
      date: 'June 25–29, 2025',
      location: 'Somerset, England',
      details: 'Headliners include The 1975, Neil Young, and Olivia Rodrigo.'
    },
    {
      name: 'Coachella Valley Music and Arts Festival',
      date: 'April 2025',
      location: 'Indio, California, USA',
      details: 'A premier festival featuring a diverse lineup of artists.'
    },
    {
      name: 'Tomorrowland',
      date: 'July 2025',
      location: 'Boom, Belgium',
      details: 'One of the world\'s largest electronic dance music festivals.'
    },
    {
      name: 'Lollapalooza',
      date: 'August 2025',
      location: 'Chicago, Illinois, USA',
      details: 'Features a diverse lineup including Olivia Rodrigo and A$AP Rocky.'
    },
    {
      name: 'Burning Man',
      date: 'August 2025',
      location: 'Black Rock Desert, Nevada, USA',
      details: 'An annual gathering focusing on community, art, self-expression, and self-reliance.'
    },
    {
      name: 'Roskilde Festival',
      date: 'June/July 2025',
      location: 'Roskilde, Denmark',
      details: 'A festival known for its diverse lineup and focus on sustainability.'
    },
    {
      name: 'Ultra Music Festival',
      date: 'March 2025',
      location: 'Miami, Florida, USA',
      details: 'A premier electronic music festival featuring top DJs.'
    },
    {
      name: 'Montreux Jazz Festival',
      date: 'July 2025',
      location: 'Montreux, Switzerland',
      details: 'A renowned festival featuring jazz, blues, and rock artists.'
    },
    {
      name: 'Rock in Rio',
      date: 'September 2025',
      location: 'Rio de Janeiro, Brazil',
      details: 'One of the largest music festivals featuring rock and pop artists.'
    },
    {
      name: 'Fuji Rock Festival',
      date: 'July 2025',
      location: 'Niigata Prefecture, Japan',
      details: 'A festival set against the backdrop of Japan\'s mountains, featuring rock and electronic music.'
    },
    {
      name: 'SXSW (South by Southwest)',
      date: 'March 2025',
      location: 'Austin, Texas, USA',
      details: 'A convergence of music, film, and technology with showcases from emerging artists.'
    },
    {
      name: 'Bonnaroo Music and Arts Festival',
      date: 'June 12–15, 2025',
      location: 'Manchester, Tennessee, USA',
      details: 'A festival known for its eclectic lineup and vibrant campground culture.'
    },
    {
      name: 'Creamfields',
      date: 'August 2025',
      location: 'Daresbury, England',
      details: 'A premier electronic music festival featuring top DJs.'
    },
    {
      name: 'Defqon.1 Festival',
      date: 'June 2025',
      location: 'Biddinghuizen, Netherlands',
      details: 'One of the biggest hardstyle festivals in the world.'
    },
    {
      name: 'Sunburn Festival',
      date: 'December 2025',
      location: 'Goa, India',
      details: 'Asia\'s largest electronic music festival with international DJs.'
    },
    {
      name: 'Vida Festival',
      date: 'July 2025',
      location: 'Vilanova i la Geltrú, Spain',
      details: 'Features artists like Future Islands and Supergrass.'
    }
  ],
  scienceTech: [
    {
      name: 'Mobile World Congress (MWC) 2026',
      date: 'March 2–5, 2026',
      location: 'Barcelona, Spain',
      details: 'The 2025 edition set a record with 109,000 attendees from 205 countries, focusing on advancements in mobile technology and AI.'
    },
    {
      name: 'Google Cloud Next \'26',
      date: 'April 22–24, 2026',
      location: 'Las Vegas, Nevada, USA',
      details: 'Highlights include AI advancements, cloud infrastructure updates, and the introduction of new tools like the Willow quantum chip.'
    },
    {
      name: 'Game Developers Conference (GDC) 2026',
      date: 'March 2026',
      location: 'San Francisco, California, USA',
      details: 'A pivotal event for the gaming industry, featuring discussions on AI integration and industry trends.'
    },
    {
      name: 'NVIDIA GPU Technology Conference (GTC) 2026',
      date: 'March 2026',
      location: 'San Jose, California, USA',
      details: 'Known as the "Super Bowl" of AI, covering topics from robotics to quantum computing.'
    },
    {
      name: 'GITEX Asia 2025',
      date: 'April 23–25, 2025',
      location: 'Singapore',
      details: 'Features over 5,000 exhibitors and 500 speakers discussing AI, 5G, blockchain, and more.'
    },
    {
      name: 'Web Summit 2025',
      date: 'November 10–13, 2025',
      location: 'Lisbon, Portugal',
      details: 'A major tech conference covering internet technology, emerging tech, and venture capitalism.'
    },
    {
      name: 'Worldwide Developers Conference (WWDC) 2025',
      date: 'June 9–13, 2025',
      location: 'Cupertino, California, USA',
      details: 'Apple\'s annual event showcasing new software and technologies across its platforms.'
    },
    {
      name: 'SIGGRAPH 2025',
      date: 'August 2025',
      location: 'Vancouver, Canada & Virtual',
      details: 'Focuses on computer graphics and interactive techniques, attracting professionals worldwide.'
    },
    {
      name: 'CTBT: Science and Technology Conference (SnT) 2025',
      date: 'September 2025',
      location: 'Vienna, Austria',
      details: 'Discusses advancements in verification technologies and scientific research.'
    },
    {
      name: 'BIOST 2025 - 4th World Biological Science and Technology Conference',
      date: 'January 9–11, 2025',
      location: 'Macau, China',
      details: 'Covers topics in biological science and technology.'
    },
    {
      name: 'ASTC 2025 Annual Conference',
      date: 'September 5–8, 2025',
      location: 'San Francisco, California, USA',
      details: 'Brings together science center professionals to discuss public engagement in science.'
    },
    {
      name: 'TechFusion 2025',
      date: 'March 25, 2025',
      location: 'Phoenix, Arizona, USA',
      details: 'Focuses on AI, IT, and computer science innovations.'
    },
    {
      name: 'Burnley Science & Technology Festival 2025',
      date: 'October 2025',
      location: 'Burnley, UK',
      details: 'Celebrates science and technology with interactive exhibits and talks.'
    },
    {
      name: 'FAT 2025 - 7th Euro-Global Conference on Food Science and Technology',
      date: 'September 2025',
      location: 'Rome, Italy',
      details: 'Discusses advancements in food science and technology.'
    },
    {
      name: 'NARST 2025 Annual International Conference',
      date: 'April 2025',
      location: 'Chicago, Illinois, USA',
      details: 'Focuses on science education research and practices.'
    },
    {
      name: 'LAcon V - 84th World Science Fiction Convention',
      date: 'August 26–31, 2026',
      location: 'Anaheim, California, USA',
      details: 'Celebrates science fiction with panels, awards, and discussions on future tech.'
    },
    {
      name: 'CES 2026',
      date: 'January 2026',
      location: 'Las Vegas, Nevada, USA',
      details: 'Showcases the latest in consumer electronics and technology innovations.'
    },
    {
      name: 'TechCrunch Disrupt 2025',
      date: 'September 2025',
      location: 'San Francisco, California, USA',
      details: 'Features startup pitches, tech discussions, and networking opportunities.'
    },
    {
      name: 'RE•WORK AI in Finance Summit 2025',
      date: 'June 2025',
      location: 'New York City, New York, USA',
      details: 'Explores AI applications in the financial sector.'
    },
    {
      name: 'IEEE International Conference on Robotics and Automation (ICRA) 2025',
      date: 'May 2025',
      location: 'London, UK',
      details: 'Discusses advancements in robotics and automation technologies.'
    },
    {
      name: 'International Conference on Machine Learning (ICML) 2025',
      date: 'July 2025',
      location: 'Vienna, Austria',
      details: 'Covers machine learning research and applications.'
    },
    {
      name: 'DEF CON 33',
      date: 'August 2025',
      location: 'Las Vegas, Nevada, USA',
      details: 'One of the world\'s largest hacker conventions, focusing on cybersecurity.'
    },
    {
      name: 'Black Hat USA 2025',
      date: 'August 2025',
      location: 'Las Vegas, Nevada, USA',
      details: 'Provides security professionals with the latest in research and trends.'
    },
    {
      name: 'International Conference on Quantum Computing and Engineering (QCE) 2025',
      date: 'October 2025',
      location: 'Denver, Colorado, USA',
      details: 'Focused on quantum computing technologies, engineering challenges, and applications.'
    },
    {
      name: 'AI Hardware & Edge AI Summit 2025',
      date: 'September 2025',
      location: 'Santa Clara, California, USA',
      details: 'Discusses innovations in AI hardware, model optimization, and on-device AI.'
    },
    {
      name: 'ClimateTech Summit 2025',
      date: 'October 2025',
      location: 'London, UK',
      details: 'Focused on technology solutions for climate change mitigation and sustainability.'
    },
    {
      name: 'Space Tech Expo Europe 2025',
      date: 'November 18–20, 2025',
      location: 'Bremen, Germany',
      details: 'Europe\'s largest B2B event for the space industry.'
    },
    {
      name: 'AI Expo Africa 2025',
      date: 'September 2025',
      location: 'Cape Town, South Africa',
      details: 'Focuses on AI, machine learning, and data science innovations for the African continent.'
    },
    {
      name: 'Smart City Expo World Congress 2025',
      date: 'November 4–6, 2025',
      location: 'Barcelona, Spain',
      details: 'Technologies for smart cities including IoT, AI, and sustainable urban development.'
    },
    {
      name: 'Women in Tech Global Conference 2026',
      date: 'May 2026',
      location: 'Virtual & In-Person (Global)',
      details: 'Celebrating and empowering women in technology across industries, with focus on AI, blockchain, and leadership.'
    }
  ],
  business: [
    {
      name: 'International Conference on Business, Economics and Information Technology (ICBEIT)',
      date: 'May 3, 2025',
      location: 'Singapore',
      details: 'Focuses on the latest advancements in business, economics, and IT.'
    },
    {
      name: 'International Conference on Economics and Business Management (ICEBM)',
      date: 'May 3, 2025',
      location: 'Singapore',
      details: 'Discusses contemporary issues in economics and business management.'
    },
    {
      name: 'International Conference on Business, Economics, Management and Marketing (ICBEMM)',
      date: 'May 3, 2025',
      location: 'Rome, Italy',
      details: 'Explores the intersection of business disciplines and marketing strategies.'
    },
    {
      name: 'International Conference on Economic and Administrative Sciences (ICEAAS)',
      date: 'May 3, 2025',
      location: 'Rome, Italy',
      details: 'Addresses topics in economic policies and administrative sciences.'
    },
    {
      name: 'International Conference on Management, Operations Research and Economics (ICMORE)',
      date: 'May 3, 2025',
      location: 'Rome, Italy',
      details: 'Focuses on the synergy between management practices and operational research.'
    },
    {
      name: 'International Conference on Economy, Management and Marketing (ICEMM)',
      date: 'May 3, 2025',
      location: 'Rome, Italy',
      details: 'Discusses trends and challenges in economy, management, and marketing.'
    },
    {
      name: 'International Conference on Business, Economics, Financial Sciences and Management (ICBEFSM)',
      date: 'May 3, 2025',
      location: 'Singapore',
      details: 'Covers a broad spectrum of topics in business and financial sciences.'
    },
    {
      name: 'International Conference on Management, Economics and Industrial Engineering (ICMEIE)',
      date: 'May 20, 2025',
      location: 'Berlin, Germany',
      details: 'Explores the integration of management principles in industrial engineering.'
    },
    {
      name: 'International Conference on Business, Economics and Management (ICBEM)',
      date: 'May 20, 2025',
      location: 'Las Vegas, USA',
      details: 'Discusses contemporary issues in business and economic management.'
    },
    {
      name: 'International Conference on Business, Economics and Finance (ICBEF)',
      date: 'May 24, 2025',
      location: 'London, UK',
      details: 'Focuses on the latest research in business, economics, and finance.'
    },
    {
      name: 'International Conference on Business and Management (ICBM)',
      date: 'May 24, 2025',
      location: 'Barcelona, Spain',
      details: 'Addresses emerging trends in business and management practices.'
    },
    {
      name: 'International Conference on Economics and Management (ICEM)',
      date: 'May 24, 2025',
      location: 'Barcelona, Spain',
      details: 'Discusses the interplay between economic theories and management strategies.'
    },
    {
      name: 'International Conference on Business, Economics and Financial Applications (ICBEFA)',
      date: 'May 24, 2025',
      location: 'Batumi, Georgia',
      details: 'Explores practical applications in business, economics, and finance.'
    },
    {
      name: 'International Conference on Business, Economics and Management (ICBEM)',
      date: 'May 24, 2025',
      location: 'Montreal, Canada',
      details: 'Focuses on interdisciplinary approaches in business and economics.'
    },
    {
      name: 'International Conference on Business, Economics, Management and Marketing (ICBEMM)',
      date: 'June 3, 2025',
      location: 'Rome, Italy',
      details: 'Discusses integrated strategies in business, economics, and marketing.'
    },
    {
      name: 'International Conference on Finance and Business Economics (ICFBE)',
      date: 'June 3, 2025',
      location: 'New York, USA',
      details: 'Addresses financial theories and their application in business economics.'
    },
    {
      name: 'International Conference on International Marketing and Relationship Management (ICIMRM)',
      date: 'June 3, 2025',
      location: 'New York, USA',
      details: 'Explores global marketing strategies and relationship management.'
    },
    {
      name: 'International Conference on Economics and Business Administration (ICEBA)',
      date: 'June 7, 2025',
      location: 'San Francisco, USA',
      details: 'Discusses administrative practices in economics and business.'
    },
    {
      name: 'International Conference on Management, Business and Economics (ICMBE)',
      date: 'June 7, 2025',
      location: 'San Francisco, USA',
      details: 'Focuses on integrated approaches in management, business, and economics.'
    },
    {
      name: 'International Conference on Economics, Business, Management and Finance Research (ICEBMFR)',
      date: 'June 7, 2025',
      location: 'San Francisco, USA',
      details: 'Discusses research methodologies in economics, business, and finance.'
    },
    {
      name: 'International Conference on Entrepreneurship, Management and Sustainable Development (ICEMSD)',
      date: 'June 7, 2025',
      location: 'San Francisco, USA',
      details: 'Explores sustainable development practices in entrepreneurship and management.'
    },
    {
      name: 'International Conference on Strategic Marketing (ICSM)',
      date: 'June 7, 2025',
      location: 'San Francisco, USA',
      details: 'Discusses strategic approaches in marketing and business growth.'
    },
    {
      name: 'International Conference on Business Innovation and Technology Management (ICBITM)',
      date: 'July 12, 2025',
      location: 'New York, USA',
      details: 'Focuses on innovative practices in business and technology management.'
    },
    {
      name: 'International Conference on Technological Innovation, Entrepreneurship and Management (ICTIEM)',
      date: 'August 9, 2025',
      location: 'New York, USA',
      details: 'Explores the nexus of technology, entrepreneurship, and management strategies.'
    },
    {
      name: 'World Trade Organization (WTO) Ministerial Conference',
      date: 'March 26–29, 2026',
      location: 'Cameroon',
      details: 'A biennial conference where trade ministers from around the globe gather to negotiate and update trade rules.'
    }
  ],
  art: [
    {
      name: 'Venice Biennale',
      date: 'May–November 2025',
      location: 'Venice, Italy',
      details: 'World\'s most prestigious contemporary art biennale, held since 1895.'
    },
    {
      name: 'Documenta 16',
      date: 'June–September 2027 (next edition)',
      location: 'Kassel, Germany',
      details: 'Largest global contemporary art exhibition, held every 5 years.'
    },
    {
      name: 'Whitney Biennial',
      date: 'March–August 2026 (expected)',
      location: 'New York City, USA',
      details: 'Major survey of American contemporary art and trends.'
    },
    {
      name: 'São Paulo Biennial',
      date: 'September–December 2025',
      location: 'São Paulo, Brazil',
      details: 'Biggest art exhibition in Latin America with global artists.'
    },
    {
      name: 'Sharjah Biennial',
      date: 'February–June 2026',
      location: 'Sharjah, UAE',
      details: 'Focus on art from the Global South — Middle East, Africa, Asia.'
    },
    {
      name: 'Art Basel Switzerland',
      date: 'June 12–15, 2025',
      location: 'Basel, Switzerland',
      details: 'Leading international fair for modern and contemporary art.'
    },
    {
      name: 'Art Basel Miami Beach',
      date: 'December 5–8, 2025',
      location: 'Miami Beach, USA',
      details: 'Premier art show for the Americas featuring global galleries.'
    },
    {
      name: 'Art Basel Hong Kong',
      date: 'March 20–22, 2026',
      location: 'Hong Kong',
      details: 'Asian edition showcasing contemporary and modern Asian art.'
    },
    {
      name: 'Frieze London',
      date: 'October 15–19, 2025',
      location: 'London, UK',
      details: 'One of the world\'s leading contemporary art fairs.'
    },
    {
      name: 'Frieze Los Angeles',
      date: 'February 13–16, 2026',
      location: 'Los Angeles, USA',
      details: 'Contemporary art fair bringing global and West Coast art scenes together.'
    },
    {
      name: 'India Art Fair',
      date: 'January 30–February 2, 2026',
      location: 'New Delhi, India',
      details: 'South Asia\'s leading platform for contemporary and modern art.'
    },
    {
      name: 'Kochi-Muziris Biennale',
      date: 'December 12, 2024–April 10, 2025',
      location: 'Kochi, Kerala, India',
      details: 'Largest contemporary art festival in South Asia.'
    },
    {
      name: 'Untitled Art Fair Houston',
      date: 'September 2025 (Debut Edition)',
      location: 'Houston, Texas, USA',
      details: 'New fair highlighting emerging and underrepresented artists.'
    },
    {
      name: 'SFMOMA Art Bash',
      date: 'May 2025 (expected)',
      location: 'San Francisco, USA',
      details: 'Fundraiser with immersive art installations and performances.'
    },
    {
      name: 'Centre Pompidou Surrealism Exhibition',
      date: 'Fall 2025 (September–December)',
      location: 'Paris, France',
      details: '100th anniversary celebration of André Breton\'s Surrealism Manifesto.'
    },
    {
      name: 'Musée d\'Art Moderne Atomic Art Exhibit',
      date: 'October 2025–January 2026',
      location: 'Paris, France',
      details: 'Art responding to the nuclear age and scientific discoveries.'
    },
    {
      name: 'Musée National Picasso - Jackson Pollock Exhibition',
      date: 'September 2025–January 2026',
      location: 'Paris, France',
      details: 'Focused on Pollock\'s early abstract expressionist works.'
    },
    {
      name: 'Fondation Louis Vuitton - Tom Wesselmann Retrospective',
      date: 'November 2025–March 2026',
      location: 'Paris, France',
      details: 'Major retrospective of American Pop Art pioneer.'
    },
    {
      name: 'Lascaux Cave Paintings (Exhibition)',
      date: 'Ongoing exhibitions globally (replicas touring)',
      location: 'Worldwide (Replica caves in France)',
      details: 'Prehistoric cave art exhibitions highlighting humanity\'s earliest art.'
    },
    {
      name: 'Leonardo da Vinci – Mona Lisa Anniversary Events',
      date: '2025–2026 (Special Exhibits)',
      location: 'Paris, France (Louvre Museum)',
      details: 'Special programs celebrating Mona Lisa\'s legacy.'
    },
    {
      name: 'Michelangelo\'s Sistine Chapel Virtual Experience',
      date: 'Throughout 2025–2026',
      location: 'Traveling exhibitions worldwide',
      details: 'Life-size digital exhibitions of the Sistine Chapel frescoes.'
    },
    {
      name: 'Rembrandt Anniversary Exhibition',
      date: '2026 (Special Events)',
      location: 'Amsterdam, Netherlands (Rijksmuseum)',
      details: 'Marking important milestones of Rembrandt\'s work.'
    },
    {
      name: 'Van Gogh Alive Experience',
      date: 'Ongoing 2025–2026 Tours',
      location: 'Global (New cities added frequently)',
      details: 'Immersive exhibition of Van Gogh\'s paintings with music and projections.'
    },
    {
      name: 'Picasso & Guernica Special Tour',
      date: 'Spring 2025–Winter 2025',
      location: 'Madrid, Spain (Museo Reina Sofía)',
      details: 'Special focus on Picasso\'s "Guernica" and anti-war art.'
    },
    {
      name: 'Banksy Urban Art Exhibitions',
      date: 'Ongoing 2025–2026',
      location: 'Global (Exhibitions in London, NYC, and Paris)',
      details: 'Touring showcases of Banksy\'s street art and activism.'
    }
  ],
  community: [
    {
      name: 'Neighborhood Block Party',
      date: 'July 15, 2025',
      location: 'Any local residential street or park',
      details: 'Close off a neighborhood street for games, food, music, and fun activities to foster community spirit.'
    },
    {
      name: 'Cultural Heritage Festival',
      date: 'August 20, 2025',
      location: 'Local community center or outdoor venue',
      details: 'Celebrate the diverse cultures in your community with food stalls, performances, and art displays.'
    },
    {
      name: 'Seasonal Potluck Picnic',
      date: 'June 25, 2025',
      location: 'Local park or community garden',
      details: 'Invite neighbors to bring dishes from their cultural background to share, promoting culinary diversity.'
    },
    {
      name: 'Outdoor Movie Night',
      date: 'September 5, 2025',
      location: 'Local park or public square',
      details: 'Set up a projector to screen a family-friendly movie under the stars. Provide free popcorn and drinks.'
    },
    {
      name: 'Community Talent Show',
      date: 'October 10, 2025',
      location: 'Community center or school auditorium',
      details: 'Showcase local talent in singing, dancing, comedy, and art. Encourage family participation.'
    },
    {
      name: 'Community Garden Project',
      date: 'April 10, 2025',
      location: 'Local park or vacant lot',
      details: 'Organize volunteers to plant vegetables and flowers, creating a shared green space for healthy living.'
    },
    {
      name: 'Walking Groups',
      date: 'Every Saturday, ongoing',
      location: 'Local park or scenic walking trail',
      details: 'Establish weekly walking groups to promote fitness, health, and social interaction. Open to all ages.'
    },
    {
      name: 'Yoga in the Park',
      date: 'May 5, 2025',
      location: 'Local park',
      details: 'Host free yoga sessions outdoors to encourage physical and mental well-being, especially in a natural setting.'
    },
    {
      name: 'Health Fair',
      date: 'June 15, 2025',
      location: 'Community center or large outdoor space',
      details: 'Bring health professionals together to offer free screenings, wellness workshops, and health-related information.'
    },
    {
      name: 'Mental Health Awareness Workshop',
      date: 'September 25, 2025',
      location: 'Local community center or online',
      details: 'Host workshops to raise awareness about mental health issues and provide resources for support.'
    },
    {
      name: 'Neighborhood Clean-Up Day',
      date: 'April 18, 2025',
      location: 'Local streets, parks, or riversides',
      details: 'Organize a day where volunteers clean up litter in the neighborhood, encouraging environmental responsibility.'
    },
    {
      name: 'Tree Planting Initiative',
      date: 'March 22, 2025 (Earth Day Week)',
      location: 'Local parks, schools, or public areas',
      details: 'Engage residents to plant trees in urban spaces, enhancing green areas and promoting sustainability.'
    },
    {
      name: 'Recycling Drive',
      date: 'November 12, 2025',
      location: 'Local community center or designated drop-off sites',
      details: 'Encourage community members to recycle and provide resources for proper waste management.'
    }
  ],
  health: [
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'May 3, 2025',
      location: 'Singapore',
      details: 'Focuses on advancements in physical education and sports science.'
    },
    {
      name: 'International Conference on Kinesiology, Exercise and Sport Sciences (ICKESS)',
      date: 'May 3, 2025',
      location: 'Rome, Italy',
      details: 'Discusses recent research in kinesiology and exercise sciences.'
    },
    {
      name: 'International Conference on Sport Science (ICSS)',
      date: 'May 6, 2025',
      location: 'Istanbul, Turkey',
      details: 'Covers various topics in sport science and its applications.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'May 11, 2025',
      location: 'Honolulu, USA',
      details: 'Explores developments in physical education methodologies.'
    },
    {
      name: 'International Conference on Kinesiology, Exercise and Sport Sciences (ICKESS)',
      date: 'May 13, 2025',
      location: 'Amsterdam, Netherlands',
      details: 'Focuses on the integration of exercise science in health promotion.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'May 17, 2025',
      location: 'Florence, Italy',
      details: 'Discusses innovative approaches in physical education.'
    },
    {
      name: 'International Conference on Kinesiology, Exercise and Sport Sciences (ICKESS)',
      date: 'May 20, 2025',
      location: 'Berlin, Germany',
      details: 'Highlights recent studies in exercise science and kinesiology.'
    },
    {
      name: 'Digital Health Congress',
      date: 'May 29, 2025',
      location: 'London, UK',
      details: 'Focuses on digital innovations in healthcare delivery.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'June 3, 2025',
      location: 'Sofia, Bulgaria',
      details: 'Discusses advancements in sport science education.'
    },
    {
      name: 'International Conference on Kinesiology, Exercise and Sport Sciences (ICKESS)',
      date: 'June 7, 2025',
      location: 'San Francisco, USA',
      details: 'Explores the role of exercise science in health promotion.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'June 13, 2025',
      location: 'Amsterdam, Netherlands',
      details: 'Covers topics in physical education and its impact on health.'
    },
    {
      name: 'International Conference on Sport Science (ICSS)',
      date: 'June 17, 2025',
      location: 'Paris, France',
      details: 'Discusses recent findings in sport science research.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'June 20, 2025',
      location: 'Vancouver, Canada',
      details: 'Focuses on innovative practices in physical education.'
    },
    {
      name: 'International Conference on Kinesiology, Exercise and Sport Sciences (ICKESS)',
      date: 'June 24, 2025',
      location: 'London, UK',
      details: 'Explores the integration of exercise science in public health.'
    },
    {
      name: 'International Conference on Sport Science (ICSS)',
      date: 'June 27, 2025',
      location: 'Tokyo, Japan',
      details: 'Discusses global trends in sport science and health.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'July 3, 2025',
      location: 'Rome, Italy',
      details: 'Covers advancements in physical education methodologies.'
    },
    {
      name: 'International Conference on Kinesiology, Exercise and Sport Sciences (ICKESS)',
      date: 'July 7, 2025',
      location: 'Paris, France',
      details: 'Focuses on the role of exercise science in health promotion.'
    },
    {
      name: 'International Conference on Sport Science (ICSS)',
      date: 'July 10, 2025',
      location: 'Sydney, Australia',
      details: 'Discusses recent research in sport science applications.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'July 15, 2025',
      location: 'New York, USA',
      details: 'Explores innovative approaches in physical education.'
    },
    {
      name: 'International Conference on Kinesiology, Exercise and Sport Sciences (ICKESS)',
      date: 'July 20, 2025',
      location: 'Barcelona, Spain',
      details: 'Highlights recent studies in exercise science and kinesiology.'
    },
    {
      name: 'International Conference on Sport Science (ICSS)',
      date: 'July 24, 2025',
      location: 'Berlin, Germany',
      details: 'Covers various topics in sport science and its applications.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'August 3, 2025',
      location: 'Tokyo, Japan',
      details: 'Discusses advancements in physical education methodologies.'
    },
    {
      name: 'International Conference on Kinesiology, Exercise and Sport Sciences (ICKESS)',
      date: 'August 7, 2025',
      location: 'Rome, Italy',
      details: 'Explores the role of exercise science in health promotion.'
    },
    {
      name: 'International Conference on Sport Science (ICSS)',
      date: 'August 10, 2025',
      location: 'Paris, France',
      details: 'Discusses recent findings in sport science research.'
    },
    {
      name: 'International Conference on Physical Education and Sport Science (ICPESS)',
      date: 'August 15, 2025',
      location: 'Sydney, Australia',
      details: 'Focuses on innovative practices in physical education.'
    }
  ],
  sports: [
    {
      name: 'Monaco Grand Prix (Formula 1)',
      date: 'May 23-25, 2025',
      location: 'Monte Carlo, Monaco',
      details: 'One of the most prestigious races in the Formula 1 calendar, known for its challenging circuit through the streets of Monaco.'
    },
    {
      name: 'UEFA Champions League Final',
      date: 'May 31, 2025',
      location: 'Allianz Arena, Munich, Germany',
      details: 'The pinnacle of European club football, determining the continent\'s top team.'
    },
    {
      name: 'French Open (Roland-Garros)',
      date: 'May 25 - June 8, 2025',
      location: 'Paris, France',
      details: 'One of the four Grand Slam tennis tournaments, played on clay courts.'
    },
    {
      name: 'UEFA Europa League Final',
      date: 'May 21, 2025',
      location: 'San Mamés Stadium, Bilbao, Spain',
      details: 'Second-tier European club football competition final.'
    },
    {
      name: 'UEFA Conference League Final',
      date: 'May 28, 2025',
      location: 'Wrocław, Poland',
      details: 'Final of Europe\'s third-tier club competition.'
    },
    {
      name: 'US Open Golf',
      date: 'June 12-15, 2025',
      location: 'Oakmont Country Club, Pittsburgh, USA',
      details: 'One of golf\'s four major championships.'
    },
    {
      name: 'Wimbledon Championships',
      date: 'June 30 - July 13, 2025',
      location: 'London, England',
      details: 'The oldest tennis tournament in the world and a Grand Slam event.'
    },
    {
      name: 'FIFA Club World Cup',
      date: 'June 15 - July 13, 2025',
      location: 'USA',
      details: 'Brings together champion clubs from each continent.'
    },
    {
      name: 'Tour de France',
      date: 'July 2025',
      location: 'France',
      details: 'The most prestigious cycling race in the world.'
    },
    {
      name: 'Summer World Masters Games',
      date: 'May 17-30, 2025',
      location: 'Taipei and New Taipei City, Taiwan',
      details: 'International multi-sport event for athletes aged 30 and above.'
    },
    {
      name: 'World Games 2025',
      date: 'August 7-17, 2025',
      location: 'Chengdu, China',
      details: 'Features sports not included in the Olympic Games.'
    },
    {
      name: 'US Open Tennis',
      date: 'August 25 - September 7, 2025',
      location: 'New York, USA',
      details: 'Final Grand Slam tournament of the tennis calendar.'
    },
    {
      name: 'Ryder Cup',
      date: 'September 25-28, 2025',
      location: 'Bethpage Black, New York, USA',
      details: 'Biennial men\'s golf competition between teams from Europe and the USA.'
    },
    {
      name: 'Laver Cup',
      date: 'September 19-21, 2025',
      location: 'Chase Center, San Francisco, USA',
      details: 'Team competition pitting Europe against the rest of the world.'
    },
    {
      name: 'Singapore Grand Prix (Formula 1)',
      date: 'October 2-6, 2025',
      location: 'Marina Bay Street Circuit, Singapore',
      details: 'Night race through the streets of Singapore.'
    },
    {
      name: 'Las Vegas Grand Prix (Formula 1)',
      date: 'November 20-22, 2025',
      location: 'Las Vegas, USA',
      details: 'New addition to the F1 calendar, featuring a street circuit.'
    },
    {
      name: 'Abu Dhabi Grand Prix (Formula 1)',
      date: 'December 5-7, 2025',
      location: 'Yas Marina Circuit, Abu Dhabi, UAE',
      details: 'Season finale of the Formula 1 World Championship.'
    },
    {
      name: 'SEA Games 2025',
      date: 'December 9-20, 2025',
      location: 'Bangkok, Chonburi, and Songkhla, Thailand',
      details: 'Biennial multi-sport event involving Southeast Asian nations.'
    },
    {
      name: 'Winter Olympics 2026',
      date: 'February 6-22, 2026',
      location: 'Milan and Cortina, Italy',
      details: 'International winter multi-sport event.'
    },
    {
      name: 'Super Bowl 2026',
      date: 'February 8, 2026',
      location: 'Levi\'s Stadium, San Francisco Bay Area',
      details: 'Championship game of the National Football League (NFL).'
    },
    {
      name: 'Cricket ICC Champions Trophy 2025',
      date: 'February-March 2025',
      location: 'Pakistan',
      details: 'International ODI cricket tournament organized by the ICC.'
    },
    {
      name: 'Indian Premier League (IPL) 2025 Final',
      date: 'May 2025',
      location: 'India',
      details: 'The grand finale of the world\'s biggest T20 cricket league.'
    },
    {
      name: 'World Athletics Championships 2025',
      date: 'August 15-24, 2025',
      location: 'Tokyo, Japan',
      details: 'Premier global track and field competition.'
    },
    {
      name: 'European Athletics Championships 2026',
      date: 'August 6-12, 2026',
      location: 'Birmingham, UK',
      details: 'Major continental track and field championship.'
    },
    {
      name: 'WWE WrestleMania 42',
      date: 'April 2026',
      location: 'U.S. (rumored Las Vegas or Los Angeles)',
      details: 'World\'s biggest pro wrestling entertainment event.'
    }
  ]
};
const faqData = {
  1: {
    question: 'What is women empowerment?',
    answer: 'Women empowerment refers to the process of providing women with the tools, resources, and opportunities to make decisions and take control of their lives, both personally and professionally.'
  },
  2: {
    question: 'How can I get involved in mentorship programs?',
    answer: 'You can get involved in mentorship programs by exploring opportunities in your field of interest, reaching out to organizations offering mentorship, or joining platforms that connect mentors and mentees.'
  },
  3: {
    question: 'What are the benefits of attending community events?',
    answer: 'Attending community events helps you network, learn new skills, gain insights, and build meaningful connections with like-minded individuals.'
  },
  4: {
    question: 'How can I support women in tech initiatives?',
    answer: 'You can support women in tech initiatives by mentoring, sponsoring events, advocating for diversity in your workplace, and promoting equal opportunities in the tech industry.'
  },
  5: {
    question: 'What resources are available for women entrepreneurs?',
    answer: 'Resources for women entrepreneurs include funding opportunities, mentorship programs, networking events, and online platforms offering business tools and guidance.'
  }
};
const inspirationalPersonalities = {
    1: {
      name: 'Kalpana Chawla',
      story: `Kalpana Chawla, born in Karnal, Haryana, grew up with dreams of touching the skies. Despite coming from a modest background, she was determined to pursue aerospace engineering — a field few women dared to enter at the time. She moved to the United States for higher studies and earned her PhD in aerospace engineering. Selected by NASA in 1994, she first flew on Space Shuttle Columbia in 1997. Her second spaceflight ended tragically when Columbia disintegrated during re-entry in 2003. Yet, Kalpana’s legacy is eternal. She inspired millions across the globe, proving that no dream is too big, no sky too far.`
    },
    2: {
      name: 'Kiran Bedi',
      story: `Kiran Bedi shattered stereotypes when she became India’s first female IPS officer in 1972. Growing up in Amritsar, she was passionate about sports and education, excelling in tennis at a national level. Her dynamic leadership style as a police officer brought many reforms, including traffic management in Delhi and jail reforms at Tihar Prison, where she introduced education, meditation, and self-help programs. Known for her fearless attitude and incorruptible reputation, she later served as the Lieutenant Governor of Puducherry. Her journey reflects courage, innovation, and commitment to public service.`
    },
    3: {
      name: 'Indra Nooyi',
      story: `Indra Nooyi’s rise from a Chennai household to becoming the CEO of PepsiCo is a story of ambition, intelligence, and resilience. A graduate of IIM Calcutta, she moved to Yale for her master’s degree and later took leadership roles in top companies. At PepsiCo, she spearheaded strategic moves like the acquisition of Tropicana and Quaker Oats. Her leadership transformed PepsiCo’s image globally. Nooyi showed that hard work, courage, and empathy could lead to extraordinary success, becoming one of the world’s most powerful women in business.`
    },
    4: {
      name: 'Mary Kom',
      story: `Mary Kom, popularly known as "Magnificent Mary," grew up in a small village in Manipur. Coming from a humble farming family, she pursued boxing against all odds. Mary won her first World Boxing Championship in 2002 and went on to win it six times — a record. She clinched a bronze medal at the 2012 London Olympics. Despite becoming a mother of three, she returned to the ring stronger than ever, breaking stereotypes and inspiring millions with her grit and determination.`
    },
    5: {
      name: 'Saina Nehwal',
      story: `Saina Nehwal put Indian women’s badminton on the world map. Born in Haryana, she trained under Pullela Gopichand and made history as the first Indian woman to reach world No. 1 ranking in badminton. Her bronze medal at the 2012 London Olympics sparked a badminton revolution in India. Despite injuries and setbacks, Saina’s fierce spirit and dedication continued to drive her toward excellence, inspiring countless youngsters to dream big.`
    },
    6: {
      name: 'Falguni Nayar',
      story: `Falguni Nayar, founder of Nykaa, revolutionized India's beauty and e-commerce industry. After a two-decade career as an investment banker, she launched Nykaa at age 50. Her platform focused on offering curated beauty products to Indian consumers, empowering women with choices. In 2021, Nykaa’s IPO made her one of India’s richest self-made women. Falguni’s story proves that vision, passion, and the courage to start over can lead to phenomenal success, regardless of age.`
    },
    7: {
      name: 'PV Sindhu',
      story: `PV Sindhu, India's badminton sensation, made history by winning silver at the 2016 Rio Olympics and bronze at Tokyo 2020. She trained under Pullela Gopichand with immense discipline. Sindhu became the first Indian to win a gold medal at the BWF World Championships. Her journey showcases hard work, focus, and sportsmanship. She has inspired a generation of athletes and proved that consistency and humility are key to global excellence.`
    },
    8: {
      name: 'Lata Mangeshkar',
      story: `Lata Mangeshkar, the "Nightingale of India," shaped Indian music for decades. Beginning her singing career at a young age, she sang over 30,000 songs in multiple languages. Her melodies touched millions, transcending generations and geographies. She was honored with Bharat Ratna for her immense contribution. Lata’s life is a lesson in dedication, simplicity, and passion for art, making her an eternal symbol of India's cultural soul.`
    },
    9: {
      name: 'Mithali Raj',
      story: `Mithali Raj, India's cricketing legend, is the highest run-scorer in women’s international cricket. Debuting at just 16, she led India to two World Cup finals and changed the perception of women's cricket. Mithali’s calm leadership, elegant batting, and relentless pursuit of excellence helped popularize women’s cricket in India. Her journey symbolizes perseverance, quiet strength, and an unshakeable commitment to her passion.`
    },
    10: {
      name: 'Sudha Murthy',
      story: `Sudha Murthy, chairperson of Infosys Foundation, is known for her philanthropy, simplicity, and literary contributions. An engineer by training, she became the first female engineer hired at TELCO. She later dedicated her life to improving education, healthcare, and rural development in India. Sudha’s heartfelt books and her life of compassion remind us that success is best measured by the positive impact we have on others.`
    },
    11: {
      name: 'Arunima Sinha',
      story: `Arunima Sinha, a former national-level volleyball player, survived a tragic accident that resulted in the amputation of her leg. Refusing to surrender to fate, she trained rigorously and became the world's first female amputee to climb Mount Everest. Her remarkable journey across the world's highest peaks demonstrates that true strength lies not in physical ability but in an indomitable spirit.`
    },
    12: {
      name: 'Nirmala Sitharaman',
      story: `Nirmala Sitharaman, India’s first full-time woman Finance Minister, rose through merit and hard work. Trained in economics, she worked internationally before joining Indian politics. As Defense and Finance Minister, she introduced major reforms, steered through tough economic challenges, and made landmark budgetary decisions. Her journey is a shining example that knowledge, determination, and integrity can open doors to the highest offices.`
    },
    13: {
      name: 'Priyanka Chopra Jonas',
      story: `Priyanka Chopra, from winning Miss World 2000 to becoming a global superstar, showed extraordinary courage and adaptability. She carved her niche in Bollywood and then in Hollywood, starring in the TV series Quantico and several films. Priyanka also runs a production company and champions causes like girls’ education and mental health. Her life is a testament to breaking barriers and creating opportunities beyond borders.`
    },
    14: {
      name: 'Roshni Nadar Malhotra',
      story: `Roshni Nadar Malhotra, chairperson of HCL Technologies, is the first woman to lead a listed Indian IT company. With an education from Northwestern and Kellogg, she blends business success with philanthropy through the Shiv Nadar Foundation. Under her leadership, HCL continued global expansion. Roshni’s story highlights leadership with empathy and a commitment to transformative education in India.`
    },
    15: {
      name: 'Chhavi Rajawat',
      story: `Chhavi Rajawat, India’s youngest MBA sarpanch, left a corporate career to transform her ancestral village, Soda in Rajasthan. She introduced water conservation, education, and e-governance initiatives, blending modern management practices with grassroots leadership. Her journey redefines rural governance and proves that educated youth can drive meaningful change in India’s villages.`
    },
    16: {
      name: 'Ankiti Bose',
      story: `Ankiti Bose co-founded Zilingo, a fashion and technology platform, at just 23 years old. Starting with a modest vision in Southeast Asia, she scaled the startup into a multi-million-dollar company. Ankiti’s journey shattered age and gender stereotypes in the startup world, showing that innovation and boldness know no boundaries.`
    },
    17: {
      name: 'Deepika Padukone',
      story: `Deepika Padukone, one of India’s highest-paid actresses, is admired not only for her films but also for her openness about mental health struggles. She founded the Live Love Laugh Foundation to spread awareness about depression. Deepika’s story is about resilience, strength, and using fame to catalyze social change.`
    },
    18: {
      name: 'Avani Chaturvedi',
      story: `Flight Lieutenant Avani Chaturvedi made history by becoming one of India’s first female fighter pilots. She was the first Indian woman to fly a fighter aircraft solo. Coming from a small town in Madhya Pradesh, she inspired a new generation of young women to dream of careers once considered unreachable.`
    },
    19: {
      name: 'Gita Gopinath',
      story: `Gita Gopinath, an eminent economist, became the first woman to serve as Chief Economist of the International Monetary Fund (IMF). Born in Kolkata and educated at Delhi University, she rose through academia at Harvard. Gita’s story proves that rigorous intellect, global vision, and persistence can place you at the world’s decision-making tables.`
    },
    20: {
      name: 'Bhavya Lal',
      story: `Dr. Bhavya Lal, an Indian-American scientist, served as the Acting Chief of Staff at NASA. She played a critical role in advancing space exploration policies. With a background in nuclear engineering and systems analysis, she is a leading voice in space policy worldwide. Her story inspires aspiring scientists to dream beyond the earth.`
    },
    21: {
      name: 'Smriti Irani',
      story: `Smriti Irani transitioned from a successful acting career to politics, becoming a Union Cabinet Minister in India. Despite early criticism, she worked hard to build credibility, handling crucial portfolios like Education and Women & Child Development. Her journey emphasizes resilience and constant reinvention in the public eye.`
    },
    22: {
      name: 'Malala Yousafzai',
      story: `Though born in Pakistan, Malala’s story resonates globally. Shot by extremists for advocating girls’ education, she survived and became the youngest Nobel Laureate. Malala’s courage and unwavering commitment to education inspire millions across South Asia, including India, to stand up for their rights fearlessly.`
    },
    23: {
      name: 'Neerja Bhanot',
      story: `Neerja Bhanot, a brave Pan Am flight attendant, sacrificed her life saving passengers during a hijacking in 1986. Posthumously awarded the Ashoka Chakra, India's highest peacetime gallantry award, Neerja’s legacy is one of selfless courage, humanity, and duty above all.`
    },
    24: {
      name: 'Bachendri Pal',
      story: `Bachendri Pal became the first Indian woman to summit Mount Everest in 1984. Coming from a modest background in Uttarakhand, she shattered societal expectations. Her achievement paved the way for many Indian women to pursue mountaineering and adventure sports.`
    },
    25: {
      name: 'Rani Rampal',
      story: `Rani Rampal, captain of the Indian women’s hockey team, led India to historic victories, including qualifying for the Olympics after decades. Coming from a poor background, she battled societal and financial challenges to become a sporting icon. Her journey showcases grit, leadership, and unbreakable willpower.`
    }
};

// Chatbot logic
let userState = {}; // To track the state of each user

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('botMessage', 'Welcome to the Empowerment Chatbot! How can I assist you today?');

  socket.on('userMessage', async (message) => {
    console.log('User:', message);

    let botResponse = '';

    // Check user state
    if (!userState[socket.id]) {
      userState[socket.id] = { step: 'mainMenu' }; // Initialize user state
    }

    const state = userState[socket.id];

    // Global "menu" handler
    if (message.toLowerCase() === 'menu') {
      state.step = 'mainMenu';
      botResponse = `
        Please select an option by typing the corresponding number:
        1. Job Listings
        2. Community Events and Sessions
        3. Mentorship Programs
        4. Crisis Support and Legal Rights
        5. Women Empowerment Insights
        6. Inspirational Personalities
        7. Frequently Asked Questions (FAQs)
      `;
      socket.emit('botMessage', botResponse);
      return; // Exit early to prevent further processing
    }

    if (state.step === 'mainMenu') {
      // Display main menu
      if (message.toLowerCase().includes('menu') || message.toLowerCase().includes('help')) {
        botResponse = `
          Please select an option by typing the corresponding number:
          1. Job Listings
          2. Community Events and Sessions
          3. Mentorship Programs
          4. Crisis Support and Legal Rights
          5. Women Empowerment Insights
          6. Inspirational Personalities
          7. Frequently Asked Questions (FAQs)
        `;
      } else if (message === '1') {
        // Job Listings Sub-Menu
        botResponse = `
          Please select a branch in the technology field:
          1. Web Development
          2. Software Development
          3. Data Science
          4. Blockchain
          5. AI/ML
          6. Cybersecurity
        `;
        state.step = 'jobBranch'; // Update user state to job branch selection
      } else if (message === '2') {
        // Community Events and Sessions Sub-Menu
        botResponse = `
          Please select a category for community events:
          1. Music
          2. Business & Professional
          3. Food & Drink
          4. Community & Culture
          5. Science & Technology
          6. Health & Wellness
          7. Sports & Fitness
          8. Performing & Visual Arts
        `;
        state.step = 'eventCategory'; // Update user state to event category selection
      } else if (message === '3') {
        // Mentorship Programs
        botResponse = '<div style="text-align: left;">Here are the available mentorship programs:<br><br>';
        if (mentorshipPrograms && Object.keys(mentorshipPrograms).length > 0) {
          Object.keys(mentorshipPrograms).forEach((key, index) => {
            const program = mentorshipPrograms[key];
            botResponse += `
              <b>${index + 1}. ${program.name}</b><br>
              <b>Focus:</b> ${program.focus}<br>
              <b>Format:</b> ${program.format || 'Not specified'}<br>
              <b>Details:</b> Visit <a href="${program.link}" target="_blank">${program.name}</a> for more information.<br><br>
            `;
          });
        } else {
          botResponse += 'No mentorship programs are available at the moment.';
        }
        botResponse += '</div>';
        state.step = 'mainMenu'; // Reset user state to main menu
      } else if (message === '4') {
        // Crisis Support and Legal Rights
        botResponse = `
          <div style="text-align: left;">
            <h3>Crisis Support and Legal Rights:</h3>
            <h4>Crisis Support for Women in India:</h4>
            <ol style="padding-left: 20px;">
              <li><b>National Commission for Women (NCW) Helpline:</b> The NCW provides 24x7 support through a WhatsApp helpline (+91 72177 35372) and online complaint portals.</li>
              <li><b>Women Helpline Number - 181:</b> A universal, government-supported helpline across India offering emergency response services to women in distress.</li>
              <li><b>Sakhi One-Stop Centres:</b> These centres (over 700 across India) provide integrated support — medical aid, police assistance, legal aid, and counseling — for women facing violence.</li>
              <li><b>Police Emergency Number - 112:</b> Integrated emergency services (police, ambulance, fire) available via single 112 helpline, active across many states.</li>
              <li><b>Legal Aid by NALSA:</b> The National Legal Services Authority ensures free legal services for women under the Legal Services Authorities Act, 1987.</li>
              <li><b>Crisis Intervention Centres (CICs):</b> Supported by Delhi Commission for Women (DCW) and NGOs, these centres help in immediate assistance during sexual assault cases.</li>
              <li><b>Domestic Violence Protection Officers:</b> Appointed under the Protection of Women from Domestic Violence Act, 2005, to assist in filing complaints and getting restraining orders.</li>
              <li><b>Childline 1098:</b> For girl children and young women under 18 facing abuse, Childline India Foundation runs a 24-hour emergency helpline.</li>
              <li><b>Emergency Medical Services:</b> Every rape survivor has the right to free first-aid or medical treatment under the Criminal Law (Amendment) Act, 2013.</li>
              <li><b>Shelter Homes:</b> Temporary shelters are offered to distressed women through Swadhar Greh Scheme and Ujjawala Homes (for victims of trafficking).</li>
              <li><b>Online FIR (e-FIR):</b> In many states, women can file FIRs online without visiting a police station, particularly for cybercrimes or harassment.</li>
              <li><b>Fast-Track Special Courts (FTSCs):</b> Established to expedite trials in rape and POCSO (Protection of Children from Sexual Offences) cases.</li>
              <li><b>Mental Health Support:</b> RINPAS, NIMHANS, and NGOs like iCall provide free counseling to women trauma survivors via telephone and online platforms.</li>
              <li><b>Community Support Groups:</b> Women's self-help groups (SHGs) in rural areas act as first points of emotional and financial support during crises.</li>
              <li><b>Mahila Police Volunteers (MPVs):</b> Women appointed in villages who work as a bridge between police and community to report gender-based violence.</li>
            </ol>
            <h4>Legal Rights of Women in India:</h4>
            <ol style="padding-left: 20px;">
              <li><b>Right Against Domestic Violence:</b> Under the Protection of Women from Domestic Violence Act, 2005, women are protected from physical, verbal, emotional, sexual, and economic abuse.</li>
              <li><b>Right to Equal Pay:</b> Under the Equal Remuneration Act, 1976, women are entitled to equal pay for equal work.</li>
              <li><b>Right to Free Legal Aid:</b> Every woman, irrespective of her financial status, has a right to free legal aid under Section 12(c) of the Legal Services Authorities Act, 1987.</li>
              <li><b>Right to Protection Against Harassment at Workplace:</b> Under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013.</li>
              <li><b>Right to Maternity Benefits:</b> As per the Maternity Benefit (Amendment) Act, 2017, women are entitled to 26 weeks of paid maternity leave.</li>
              <li><b>Right to Abortion:</b> Women have the right to safe and legal abortion up to 24 weeks under the Medical Termination of Pregnancy (Amendment) Act, 2021.</li>
              <li><b>Right to Inheritance and Property:</b> Under the Hindu Succession (Amendment) Act, 2005, daughters have equal rights in ancestral property.</li>
              <li><b>Right to Register FIR Without Delay:</b> Under Section 154 of the CrPC, women can register an FIR without fear or delay at any police station.</li>
              <li><b>Right to Privacy During FIR Filing:</b> A woman has the right to have her statement recorded privately by a woman officer under Section 164 of CrPC.</li>
              <li><b>Right Against Arrest at Night:</b> Under Section 46(4) of the CrPC, women cannot be arrested after sunset and before sunrise except under special circumstances with a magistrate’s approval.</li>
              <li><b>Right Against Cyber Harassment:</b> Protection under Section 66E, 67, 67A of the Information Technology Act, 2000 for online abuse, stalking, or harassment.</li>
              <li><b>Right to Live With Dignity:</b> Guaranteed under Article 21 of the Indian Constitution (Right to Life and Personal Liberty).</li>
              <li><b>Right to Maintenance:</b> Under Section 125 CrPC, a woman can claim maintenance from her husband if she is unable to maintain herself.</li>
              <li><b>Right Against Child Marriage:</b> Under the Prohibition of Child Marriage Act, 2006, girls below 18 years of age cannot be legally married.</li>
              <li><b>Right to Protection During Pregnancy in Employment:</b> Under the Factories Act, 1948 and Maternity Benefit Act, pregnant women have the right to avoid hazardous work and are entitled to medical bonus.</li>
            </ol>
            <p>Type "menu" to return to the main menu.</p>
          </div>
        `;
        state.step = 'mainMenu'; // Reset user state to main menu
      } else if (message === '5') {
        // Women Empowerment Insights
        botResponse = `
          <div style="text-align: left;">
            <h3>Women Empowerment Insights:</h3>
            <ol style="padding-left: 20px;">
              <li><b> Gender Diversity in the Workplace:</b> Companies with gender-diverse leadership teams are 21% more likely to outperform their peers financially (McKinsey, 2020).</li>
              <li><b> Women in STEM Fields:</b> Increasing the number of women in STEM could add $12 trillion to global GDP by 2025 (World Economic Forum).</li>
              <li><b> Education for Girls:</b> Educating girls reduces child marriage rates by 64% and improves economic outcomes for families (UNICEF).</li>
              <li><b> Women in Leadership:</b> Organizations with women in leadership roles report higher employee satisfaction and retention rates.</li>
              <li><b> Economic Empowerment:</b> Women reinvest 90% of their income into their families and communities, compared to 30-40% for men (World Bank).</li>
              <li><b> Health Outcomes:</b> Empowered women are more likely to seek healthcare for themselves and their children, reducing maternal and child mortality rates.</li>
              <li><b> Political Participation:</b> Countries with higher female political representation tend to have stronger social welfare policies.</li>
              <li><b> Entrepreneurship:</b> Women-owned businesses contribute $1.8 trillion annually to the global economy.</li>
              <li><b> Reducing Poverty:</b> Empowering women in agriculture could reduce global hunger by 17% (FAO).</li>
              <li><b> Social Equality:</b> Societies with gender equality experience lower crime rates and higher levels of trust.</li>
              <li><b> Mental Health:</b> Empowered women report lower levels of stress and higher levels of life satisfaction.</li>
              <li><b> Access to Technology:</b> Bridging the gender digital divide could unlock $50 billion in economic benefits annually (GSMA).</li>
              <li><b> Climate Change Mitigation:</b> Women-led initiatives are more likely to adopt sustainable practices, reducing environmental impact.</li>
              <li><b> Education Access:</b> Empowering women increases school enrollment rates for children, especially girls.</li>
              <li><b> Workforce Participation:</b> Closing the gender gap in workforce participation could boost global GDP by $28 trillion (McKinsey).</li>
              <li><b> Financial Inclusion:</b> Women with access to financial services are more likely to invest in education and healthcare.</li>
              <li><b> Community Development:</b> Empowered women are more likely to participate in community decision-making processes.</li>
              <li><b> Innovation:</b> Women bring diverse perspectives to innovation, leading to more inclusive product designs.</li>
              <li><b> Reduced Violence:</b> Empowering women reduces domestic violence rates and promotes safer communities.</li>
              <li><b> Cultural Preservation:</b> Women play a key role in preserving cultural traditions and passing them on to future generations.</li>
              <li><b> Improved Nutrition:</b> Empowered women are more likely to ensure their families have access to nutritious food.</li>
              <li><b> Disaster Resilience:</b> Women-led communities recover faster from natural disasters due to better resource management.</li>
              <li><b> Gender Pay Gap:</b> Closing the gender pay gap could add $160 trillion to the global economy (World Bank).</li>
              <li><b> Literacy Rates:</b> Empowering women improves literacy rates, which are directly linked to economic growth.</li>
              <li><b> Peacebuilding:</b> Women’s participation in peace processes increases the likelihood of agreements lasting over 15 years by 35% (UN Women).</li>
            </ol>
            <p>Type "menu" to return to the main menu.</p>
          </div>
        `;
        state.step = 'mainMenu'; // Reset user state to main menu
      } else if (message === '6') {
        // Inspirational Personalities Sub-Menu
        botResponse = `
          <div style="text-align: left;">
            <h3>Inspirational Personalities:</h3>
            <p>Please select a number to learn more about their story:</p>
            <ol style="padding-left: 20px;">
        `;
        Object.keys(inspirationalPersonalities).forEach((key) => {
          const personality = inspirationalPersonalities[key];
          botResponse += `<li><b>${personality.name}</b></li>`;
        });
        botResponse += `
            </ol>
          </div>
        `;
        state.step = 'personalityDetails'; // Update user state to personality details selection
      } else if (message === '7') {
        // FAQs
        botResponse = `
        Frequently Asked Questions (FAQs):
          1. What is women empowerment?
          2. How can I get involved in mentorship programs?
          3. What are the benefits of attending community events?
          4. How can I support women in tech initiatives?
          5. What resources are available for women entrepreneurs?
          Type the number to learn more or "menu" to go back.
        `;
        state.step = 'faqDetails'; // Update user state to FAQ details selection
      } else {
        botResponse = 'Please type "menu" to return to the main menu.';
      }
    } else if (state.step === 'jobBranch') {
      if (message.toLowerCase() === 'menu') {
        state.step = 'mainMenu';
        //botResponse = 'Returning to the main menu. How can I assist you today?';
      } else if (!isNaN(message)) {
        let query = '';
        if (message === '1') {
          query = 'web development';
        } else if (message === '2') {
          query = 'software development';
        } else if (message === '3') {
          query = 'data science';
        } else if (message === '4') {
          query = 'blockchain';
        } else if (message === '5') {
          query = 'artificial intelligence';
        } else if (message === '6') {
          query = 'cybersecurity';
        } else {
          botResponse = 'Invalid option. Please select a valid branch or type "menu" to go back.';
        }

        if (query) {
          // Fetch job listings based on the selected branch
          const jobs = await fetchJobs(query);
          if (jobs.length > 0) {
            botResponse = `Here are some ${query} job opportunities:<br><br>`;
            jobs.forEach((job, index) => {
              botResponse += `
                ${index + 1}. <b>${job.title}</b><br>
                <b>Company</b>: ${job.company}<br>
                <b>Location</b>: ${job.location}<br>
                <b>Apply Here</b>: <a href="${job.link}" target="_blank">${job.link}</a><br><br>
              `;
            });
          } else {
            botResponse = `Sorry, I couldn't find any ${query} jobs matching your query.`;
          }
        } else {
          botResponse = 'Invalid option. Please select a valid branch or type "menu" to go back.';
        }
      } else {
        botResponse = 'Invalid option. Please select a valid branch or type "menu" to go back.';
      }
    } // <-- Added missing closing brace here
    else if (state.step === 'eventCategory') {
      if (message.toLowerCase() === 'menu') {
        state.step = 'mainMenu';
        //botResponse = 'Returning to the main menu. How can I assist you today?';
      } else if (!isNaN(message)) {
        let category = '';
        if (message === '1') {
          category = 'music';
        } else if (message === '2') {
          category = 'business';
        } else if (message === '3') {
          category = 'food'; // This category doesn't exist in your data
        } else if (message === '4') {
          category = 'community';
        } else if (message === '5') {
          category = 'scienceTech';
        } else if (message === '6') {
          category = 'health';
        } else if (message === '7') {
          category = 'sports';
        } else if (message === '8') {
          category = 'art';
        } else {
          botResponse = 'Invalid option. Please select a valid category or type "menu" to go back.';
        }

        if (category && eventsData[category]) {
          const events = eventsData[category];
          if (events.length > 0) {
            botResponse = 'Here are some upcoming community events and sessions:<br><br>';
            events.forEach((event, index) => {
              botResponse += `${index + 1}. <b>${event.name}</b><br>`;
              botResponse += `   <b>Date</b>: ${event.date}<br>`;
              botResponse += `   <b>Location</b>: ${event.location}<br>`;
              botResponse += `   <b>Details</b>: ${event.details}<br><br>`;
            });
          } else {
            botResponse = `Sorry, I couldn't find any events in the ${category} category at the moment.`;
          }
        }
      } else {
        botResponse = 'Invalid option. Please select a valid category or type "menu" to go back.';
      }
    } else if (state.step === 'mentorshipDetails') {
      if (message.toLowerCase() === 'menu') {
        state.step = 'mainMenu';
        botResponse = 'Please type menu to return to the main menu.';
      } else if (!isNaN(message) && mentorshipPrograms[parseInt(message)]) {
        const programNumber = parseInt(message);
        const program = mentorshipPrograms[programNumber];
        botResponse = `
          <b>${program.name}</b><br>
          <b>Focus:</b> ${program.focus}<br>
          <b>Format:</b> ${program.format || 'Not specified'}<br>
          <b>Details:</b> Visit <a href="${program.link}" target="_blank">${program.name}</a> for more information.<br>
        `;
        state.step = 'mainMenu'; // Reset user state to main menu
      } else {
        botResponse = 'Invalid option. Please select a valid mentorship program or type "menu" to go back.';
      }
    } else if (state.step === 'faqDetails') {
      if (message.toLowerCase() === 'menu') {
        state.step = 'mainMenu';
        botResponse = 'Please type menu to return to the main menu.';
      } else if (!isNaN(message) && faqData[parseInt(message)]) {
        const faqNumber = parseInt(message);
        const faq = faqData[faqNumber];
        botResponse = `
          <b>Q${faqNumber}: ${faq.question}</b><br>
          <b>Answer:</b> ${faq.answer}<br>
          Type "menu" to return to the main menu.
        `;
      } else {
        botResponse = 'Invalid option. Please select a valid FAQ number or type "menu" to go back.';
      }
    } else if (state.step === 'insightsDetails') {
      if (message.toLowerCase() === 'menu') {
        state.step = 'mainMenu';
        botResponse = 'Please type menu to return to the main menu.';
      } else {
        botResponse = 'Details for this selection are not available at the moment. Please type "menu" to return to the main menu.';
        state.step = 'mainMenu'; // Reset user state to main menu
      }
    } else if (state.step === 'personalityDetails') {
      if (message.toLowerCase() === 'menu') {
        state.step = 'mainMenu';
      } else if (!isNaN(message) && inspirationalPersonalities[parseInt(message)]) {
        const personalityNumber = parseInt(message);
        const personality = inspirationalPersonalities[personalityNumber];
        botResponse = `
          <div style="text-align: left;">
            <h3>${personality.name}</h3>
            <p>${personality.story}</p>
            <p>Type "menu" to return to the main menu.</p>
          </div>
        `;
      } else {
        botResponse = 'Invalid option. Please select a valid personality number or type "menu" to go back.';
      }
    }

    socket.emit('botMessage', botResponse);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete userState[socket.id]; // Clean up user state
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

