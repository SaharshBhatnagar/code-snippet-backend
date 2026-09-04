-- database name 'devhub'
-- database postgresql

BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS snippets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    code TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (title, author)
);

CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    snippet_id INTEGER REFERENCES snippets(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, snippet_id)
);

INSERT INTO snippets (title, description, code, category, author) VALUES
('JWT Authentication Hook', 'A custom React hook to manage JWT tokens, login state, and automatic token refresh securely.', 'const useAuth = () => { /* React hook logic */ };', 'react', 'Jane D.'),
('Glassmorphism Card UI', 'Pure CSS implementation of the frosted glass design trend using backdrop-filter.', '.glass-card { backdrop-filter: blur(16px) saturate(180%); }', 'css', 'Alex M.'),
('Express REST Boilerplate', 'Standard setup for an Express.js server including CORS, Helmet security, and error handling.', 'const app = express(); app.use(cors());', 'nodejs', 'Sam T.'),
('Docker Local Database', 'A quick setup command and compose file for running PostgreSQL and Redis locally.', 'version: "3.8" services: db: image: postgres', 'setup-cmd', 'Taylor R.'),
('Pandas Data Cleaning', 'Python script using Pandas to drop null values, normalize strings, and format dates.', 'df.dropna(inplace=True)', 'python', 'Chris P.'),
('Responsive CSS Grid Layout', 'A 12-column responsive grid system built entirely with CSS Grid, no media queries required.', '.grid-container { display: grid; grid-template-columns: repeat(12, 1fr); }', 'css', 'Jordan K.'),
('JWT Authentication Hook', 'Alex version of the hook.', 'function useJwt() {}', 'react', 'Alex M.')
ON CONFLICT (title, author) DO NOTHING;

COMMIT;

-- Use this to view dataset
-- SELECT * FROM snippets;
-- SELECT id, title, author FROM snippets;
-- SELECT * FROM users;


-- UPDATE snippets 
-- SET title = 'Advanced JWT Hook', description = 'Updated my hook to handle refresh tokens.'
-- WHERE id = 1 AND author = 'Jane D.';